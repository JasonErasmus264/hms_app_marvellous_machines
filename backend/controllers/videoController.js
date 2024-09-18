import express from 'express';
import multer from 'multer';  // For file uploads
import ffmpeg from 'fluent-ffmpeg';  // For video compression
import fs from 'fs';  // File system operations
import path from 'path';  // File path operations
import axios from 'axios';  // For Nextcloud upload
import pool from '../db.js';  // MySQL connection pool
import 'dotenv/config';  // Load environment variables

const router = express.Router();
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);  // 50MB in bytes

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

// Video compression function
const compressVideo = (filePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputFilePath)
      .videoCodec('libx264')
      .size('640x?')  // Resize to 640px width, maintain aspect ratio
      .on('end', () => resolve(outputFilePath))
      .on('error', (err) => reject(err))
      .run();
  });
};

// Upload video to Nextcloud
const uploadToNextcloud = async (filePath) => {
  const fileName = path.basename(filePath);
  const nextcloudPath = `/remote.php/webdav/${fileName}`;
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
    throw error;
  }
};

// Store video metadata in MySQL
const storeMetadata = async (fileName, fileSize, nextcloudUrl) => {
  const query = 'INSERT INTO videos (file_name, file_size, nextcloud_url) VALUES (?, ?, ?)';
  await pool.execute(query, [fileName, fileSize, nextcloudUrl]);
};

// Route to handle video upload with error handling for multer
router.post('/upload-video', (req, res, next) => {
  upload.single('video')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Unexpected error during file upload', details: err.message });
    }
    next();  // Proceed to the next middleware (compression and upload)
  });
}, async (req, res) => {
  const filePath = req.file.path;
  const fileSize = req.file.size;

  try {
    let finalFilePath = filePath;

    // If the file exceeds the maximum allowed size, compress it
    if (fileSize > MAX_FILE_SIZE) {
      const compressedFilePath = `uploads/compressed_${Date.now()}.mp4`;
      finalFilePath = await compressVideo(filePath, compressedFilePath);
      fs.unlinkSync(filePath);  // Delete the original file after compression
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

export default router;
