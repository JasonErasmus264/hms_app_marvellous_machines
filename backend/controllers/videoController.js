import multer from 'multer';  // For file uploads
import ffmpeg from 'fluent-ffmpeg';  // For video compression
import fs from 'fs';  // File system operations
import path from 'path';  // File path operations
import axios from 'axios';  // For Nextcloud upload
import pool from '../db.js';  // MySQL connection pool
import 'dotenv/config';  // Load environment variables

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);  // 50MB in bytes

// Set the path to the FFmpeg binary
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Set the path to ffmpeg explicitly otherwise there is trouble finding it
const ffmpegPath = '/usr/bin/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

// Video compression function
const compressVideo = (filePath, outputFilePath, maxFileSize) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputFilePath)
      .videoCodec('libx264')
      .size('?x360')  // Resize to height 360px while maintaining aspect ratio
      .videoBitrate('800k')  // Set the video bitrate to 800 kbps
      .audioBitrate('128k')  // Set audio bitrate to 128 kbps for better quality
      .outputOptions('-crf 28')  // CRF value of 28 for medium compression
      .on('end', async () => {
        try {
          // Check if the compressed file size exceeds the maximum allowed size
          const compressedSize = fs.statSync(outputFilePath).size;
          if (compressedSize > maxFileSize) {
            console.error('Compressed file still exceeds the maximum size.');
            return reject(new Error('Compressed file size exceeds the maximum allowed size'));
          }

          // If compressed size is within the limit, resolve the promise
          resolve(outputFilePath);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
};


// Upload video to Nextcloud
const uploadToNextcloud = async (filePath) => {
  const fileName = path.basename(filePath);  // Use the unique file name already generated
  const nextcloudFolder = '/HMS-Video-Uploads';  // Specify the folder path
  const nextcloudPath = `${nextcloudFolder}/${fileName}`;  // Upload to the folder
  const fileStream = fs.createReadStream(filePath);

  try {
    const response = await axios.put(`${process.env.NEXTCLOUD_URL}${nextcloudPath}`, fileStream, {
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (response.status === 201) {
      return `${process.env.NEXTCLOUD_URL}${nextcloudPath}`;
    } else {
      throw new Error('Failed to upload to Nextcloud');
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error('File already exists on Nextcloud (Conflict 409)');
    } else {
      throw error;
    }
  }
};


// Store video metadata in MySQL
const storeMetadata = async (fileName, fileSize, nextcloudUrl) => {
  const query = 'INSERT INTO videos (file_name, file_size, nextcloud_url) VALUES (?, ?, ?)';
  await pool.execute(query, [fileName, fileSize, nextcloudUrl]);
};

// Main function to handle video upload and compression
export const uploadVideo = (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Unexpected error during file upload', details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileSize = req.file.size;
    let finalFilePath = filePath;

    try {
      // If the file exceeds the maximum allowed size, compress it
      if (fileSize > MAX_FILE_SIZE) {
        const compressedFilePath = `uploads/compressed_${Date.now()}.mp4`;
        finalFilePath = await compressVideo(filePath, compressedFilePath, MAX_FILE_SIZE);

        // Delete the original file after successful compression
        fs.unlinkSync(filePath);
      }

      // Upload the (compressed or original) video to Nextcloud
      const nextcloudUrl = await uploadToNextcloud(finalFilePath);
      const finalFileName = path.basename(finalFilePath);

      // Store video metadata in the database
      await storeMetadata(finalFileName, fs.statSync(finalFilePath).size, nextcloudUrl);

      // Delete the local file after uploading to Nextcloud
      fs.unlinkSync(finalFilePath);

      res.status(200).json({ message: 'File uploaded successfully', nextcloudUrl });
    } catch (error) {
      console.error('Error during video upload:', error);
      res.status(500).json({ error: 'Failed to upload video', details: error.message });
    }
  });
};


// Retrieve video metadata from MySQL
/* export const getVideoMetadata = async (req, res) => {
  const videoId = req.params.id;

  try {
    const query = 'SELECT file_name, nextcloud_url FROM videos WHERE id = ?';
    const [rows] = await pool.execute(query, [videoId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = rows[0];

    res.status(200).json({
      fileName: videoData.file_name,
      nextcloudUrl: videoData.nextcloud_url,
    });
  } catch (error) {
    console.error('Error retrieving video data:', error);
    res.status(500).json({ error: 'Failed to retrieve video data', details: error.message });
  }
}; */



// Route to retrieve video directly from Nextcloud by ID
export const getVideoMetadata = async (req, res) => {
  const videoId = req.params.id;
  const nextcloudFolder = '/HMS-Video-Uploads';  
  const videoUrl = `${process.env.NEXTCLOUD_URL}${nextcloudFolder}/${videoId}`;  

  try {
    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
    });

    if (response.status === 200) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `inline; filename=${videoId}`);
      response.data.pipe(res);
    } else {
      res.status(404).json({ error: 'Video not found on Nextcloud' });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Video not found on Nextcloud' });
    } else {
      res.status(500).json({ error: 'Failed to retrieve video from Nextcloud', details: error.message });
    }
  }
};