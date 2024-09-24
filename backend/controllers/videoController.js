import multer from 'multer';  // For file uploads
import ffmpeg from 'fluent-ffmpeg';  // For video compression
import fs from 'fs';  // File system operations
import path from 'path';  // File path operations
import axios from 'axios';  // For Nextcloud upload
import pool from '../db.js';  // MySQL connection pool
import 'dotenv/config';  // Load environment variables


const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);  // 50MB in bytes



// Ensure 'uploads' directories exist
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
const storeMetadata = async (req, res, assignmentID, submissionVidPath ) => {
  try{
    const { userID } = req.user;

    const query = 'INSERT INTO submission (assignmentID, userID, submissionVidPath) VALUES (?, ?, ?)';

    await pool.execute(query, [assignmentID, userID, submissionVidPath]);
  } catch (error) {
    console.error('Error during metadata storing:', error);
    if (!res.headersSent) { return res.status(500).json({ message: 'Failed to store metadata', details: error.message }); }
  }
}

/* const storeMetadata = async (assignmentID, submissionVidPath) => {
  const query = `
    UPDATE submission 
    SET submissionVidPath = ? 
    WHERE assignmentID = ?`;
  
  const [result] = await pool.execute(query, [submissionVidPath, assignmentID]);

  // Optionally, you can check if any rows were affected
  if (result.affectedRows === 0) {
    throw new Error('No rows were updated. Check if the assignmentID exist.');
  }
}; */


// Retrieve video directly from Nextcloud by URL and return public video link
const getVideoUrl = async (nextcloudUrl, videoId) => {
  const nextcloudFolder = '/HMS-Video-Uploads';
  const videoPath = `${nextcloudFolder}/${videoId}`;

  const shareUrl = `https://mia.nl.tab.digital/ocs/v2.php/apps/files_sharing/api/v1/shares`;

  try {
    console.log('Requesting public link for:', videoPath); // Debugging log

    const response = await axios.post(shareUrl, null, {
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
      headers: {
        'OCS-APIRequest': true,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        path: videoPath,  // Use full Nextcloud URL
        shareType: 3,    // Public link share type
        permissions: 1,   // Read-only permissions
      },
    });
    console.log('Response from Nextcloud:', response.data); // Debugging log

    if (response.data && response.data.ocs && response.data.ocs.data && response.data.ocs.data.url) {
      const publicLink = response.data.ocs.data.url;
      return `${publicLink}/download/${videoId}`;  // Return the public link directly
    } else {
      return res.status(500).json({ error: 'Failed to generate public link' });
    }
  } catch (error) {
    console.error('Error creating public link:', error); // Log the error details
    throw new Error(`Failed to create public link: ${error.message}`);
  }
};



// Main function to handle video upload and compression
export const uploadVideo = (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract assignmentID from the request body
    const { assignmentID } = req.body;

    if (!assignmentID) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    const filePath = req.file.path;
    const fileSize = req.file.size;
    let finalFilePath = filePath;
    let videoId;

    try {
      // If the file exceeds the maximum allowed size, compress it
      if (fileSize > MAX_FILE_SIZE) {
        const compressedFilePath = `uploads/compressed_${Date.now()}.mp4`;
        finalFilePath = await compressVideo(filePath, compressedFilePath, MAX_FILE_SIZE);

        // Delete the original file after successful compression
        fs.unlinkSync(filePath);
      }

      // Upload the (compressed or original) video to Nextcloud and get link returned
      const nextcloudUrl = await uploadToNextcloud(finalFilePath);

      videoId = path.basename(nextcloudUrl); // Get the videoId from the nextcloudUrl

      const publicLink = await getVideoUrl(nextcloudUrl, videoId);

      // Store video metadata in the database, including assignmentID
      await storeMetadata(req, res, assignmentID, publicLink);

      // Delete the local file after uploading to Nextcloud
      fs.unlinkSync(finalFilePath);

      res.status(200).json({ message: 'File uploaded successfully', publicLink });
    } catch (error) {
      console.error('Error during video upload:', error);
      res.status(500).json({ message: 'Failed to upload video', details: error.message });
    }
  });
};



// Retrieve video metadata from MySQL
/* export const getVideoMetadata = async (req, res) => {
  const videoId = req.params.id;

  try {
    const query = 'SELECT fileName, submissionVidPath FROM submission WHERE assignmentID = ?';
    const [rows] = await pool.execute(query, [videoId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = rows[0];

    res.status(200).json({
      fileName: videoData.fileName,
      nextcloudUrl: videoData.submissionVidPath,
    });
  } catch (error) {
    console.error('Error retrieving video data:', error);
    res.status(500).json({ error: 'Failed to retrieve video data', details: error.message });
  }
}; */

export const getPublicUrl = async (req, res) => {
  const videoId = req.params.id;  // Retrieve video ID from URL
  const nextcloudFolder = '/HMS-Video-Uploads';  // Declare the variable here
  const videoPath = `${nextcloudFolder}/${videoId}`;  // Use the declared variable

  const shareUrl = 'https://mia.nl.tab.digital/ocs/v2.php/apps/files_sharing/api/v1/shares';

  try {
    console.log('Requesting public link for:', videoPath); // Debugging log

    const response = await axios.post(shareUrl, null, {
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
      headers: {
        'OCS-APIRequest': true,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        path: videoPath,  // Use the full video path
        shareType: 3,    // Public link share type
        permissions: 1,   // Read-only permissions
      },
    });

    console.log('Response from Nextcloud:', response.data); // Debugging log

    if (response.data && response.data.ocs && response.data.ocs.data && response.data.ocs.data.url) {
      const publicLink = response.data.ocs.data.url;

      // Construct the final link
      const fullLink = `${publicLink}/download/${videoId}`;

      res.status(200).json({ publicLink: fullLink });
    } else {
      res.status(500).json({ error: 'Failed to generate public link' });
    }
  } catch (error) {
    console.error('Error creating public link:', error); // Log the error details
    res.status(500).json({ error: 'Failed to create public link', details: error.message });
  }
};