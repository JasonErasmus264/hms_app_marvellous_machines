import multer from 'multer';  
import ffmpeg from 'fluent-ffmpeg';  
import fs from 'fs';  
import path from 'path';  
import axios from 'axios';
import pool from '../db.js';
import 'dotenv/config';
import { submissionLogger } from '../middleware/logger.js'; // import submission logger

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);  


// Function to format the date using native JS Intl.DateTimeFormat
const formatDate = (date) => {
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ' at');
};

// Controller function to fetch a single submission for a specific assignment for a specific user 
export const getSubmissionByAssignmentForUser = async (req, res) => {
  const { assignmentID } = req.params;
  const { userID } = req.user; // Extract userID from the request

  submissionLogger.info(`Fetching submission for assignmentID: ${assignmentID} by userID: ${userID}`);
  
  try {
    const [submissions] = await pool.execute(
      `SELECT s.submissionVidName, s.submissionVidPath, s.uploadedAt
       FROM submission s
       WHERE s.assignmentID = ? AND s.userID = ?`,
      [assignmentID, userID]
    );

    if (submissions.length === 0) {
      submissionLogger.warn(`No submissions found for assignmentID: ${assignmentID} by userID: ${userID}`);
      return res.status(404).json({ message: 'No submission found for this assignment for the specified user.' });
    }

    // Return the first submission found
    const submission = submissions[0];
    
    // Extract the desired video name (the name after the last hyphen)
    const videoName = submission.submissionVidName.split('-').pop().split('.').shift();

    res.json({
      submissionVidName: videoName, // Use the extracted video name
      submissionVidPath: submission.submissionVidPath,
      uploadedAt: submission.uploadedAt
    });
  } catch (error) {
    submissionLogger.error(`Error fetching submission: ${error.message}`, { error });
    res.status(500).json({ message: 'An error occurred while fetching the submission.' });
  }
};



// Function to get submissions that are "To be marked" (without feedback)
export const getNotMarkedSubmissions = async (req, res) => {
  const { assignmentID } = req.params; // Get assignmentID from the request params

  // log information on fetching unmarked submissions for an assignment (information log)
  submissionLogger.info(`Fetching unmarked submissions for assignmentID: ${assignmentID}`);
  try {
    // Query to get submissions that don't have feedback (i.e., "To be marked"), including total marks for the assignment
    const [rows] = await pool.execute(
      `SELECT s.submissionID, u.firstName, u.lastName, u.username, s.submissionVidName, s.submissionVidPath, s.uploadedAt, a.assignTotalMarks
       FROM submission s
       JOIN users u ON s.userID = u.userID
       LEFT JOIN feedback f ON s.submissionID = f.submissionID
       JOIN assignment a ON s.assignmentID = a.assignmentID
       WHERE s.assignmentID = ? AND f.submissionID IS NULL`,
      [assignmentID]
    );

    // Format the submission list
    const submission = rows.map(submission => ({
      submissionID: submission.submissionID,
      studentName: `${submission.firstName} ${submission.lastName} (${submission.username})`,
      submissionVidName: submission.submissionVidName,
      submissionVidPath: submission.submissionVidPath,
      uploadedAt: formatDate(new Date(submission.uploadedAt)), // Use formatDate function
      totalMarks: submission.assignTotalMarks, // Include total marks for the assignment
    }));

    // log successfully fetching unmarked submissions for an assignment (information log)
    submissionLogger.info(`Successfully fetched unmarked submissions for assignmentID: ${assignmentID}`);
    res.json({ submission });
  } catch (error) {
    // log any errors that may have occurred while fetching unmarked submissions for an assignment (error log)
    submissionLogger.error(`Error fetching unmarked submissions: ${error.message}`, { error });
    res.status(500).json({ message: 'Error fetching submissions to be marked.' });
  }
};



// Function to get submissions that are "Marked" (with feedback)
export const getMarkedSubmissions = async (req, res) => {
  const { assignmentID } = req.params; // Get assignmentID from the request params

  // log information on fetching marked submissions for an assignment (information log)
  submissionLogger.info(`Fetching marked submissions for assignmentID: ${assignmentID}`);
  try {
    // Query to get submissions that have feedback (i.e., "Marked"), including total marks for the assignment
    const [rows] = await pool.execute(
      `SELECT s.submissionID, u.firstName, u.lastName, u.username, s.submissionVidName, s.submissionVidPath, s.uploadedAt, a.assignTotalMarks
       FROM submission s
       JOIN users u ON s.userID = u.userID
       JOIN feedback f ON s.submissionID = f.submissionID
       JOIN assignment a ON s.assignmentID = a.assignmentID
       WHERE s.assignmentID = ?`,
      [assignmentID]
    );

    // Format the submission list
    const submission = rows.map(submission => ({
      submissionID: submission.submissionID,
      studentName: `${submission.firstName} ${submission.lastName} (${submission.username})`,
      submissionVidName: submission.submissionVidName,
      submissionVidPath: submission.submissionVidPath,
      uploadedAt: formatDate(new Date(submission.uploadedAt)), // Use formatDate function
      totalMarks: submission.assignTotalMarks, // Include total marks for the assignment
    }));

    // log successfully fetching marked submissions for an assignment (information log)
    submissionLogger.info(`Successfully fetched marked submissions for assignmentID: ${assignmentID}`);
    res.json({ submission });
  } catch (error) {
    // log any errors that may have occurred while fetching marked submissions for an assignment (error log)
    submissionLogger.error(`Error fetching marked submissions: ${error.message}`, { error });
    res.status(500).json({ message: 'Error fetching marked submissions.' });
  }
};








 
// Ensure 'uploads' directories exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  // Log creation of directory (information log)
  submissionLogger.info('Uploads directory created');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      // Extract vidName from request body
      const { vidName } = req.body; // Ensure this name is sanitized for file safety
      const sanitizedVidName = vidName.replace(/[^a-zA-Z0-9-_]/g, ''); // Remove invalid characters

      // Use vidName in the filename, appending timestamp and random string
      const newFileName = `${timestamp}-${randomString}-${sanitizedVidName}.mp4`; 
      
      // Log file received for upload (information log)
      submissionLogger.info(`File received for upload: ${file.originalname}`);
      cb(null, newFileName);
  },
});

const upload = multer({ storage });

 
// Video compression function
const compressVideo = (filePath, outputFilePath, maxFileSize) => {
  const newOutputFilePath = outputFilePath.replace(/([^\/]+)$/, '1$1');

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(newOutputFilePath)
      .videoCodec('libx264')
      .size('?x360') // Rezize the height but maintain aspect ratio
      .videoBitrate('800k')
      .audioBitrate('128k')
      .outputOptions('-crf 28')  // Medium compression
      .on('end', async () => {
        try {
          // Check if the compressed file size exceeds the maximum allowed size because very large files might need to be compressed more than once
          const compressedSize = fs.statSync(newOutputFilePath).size;
          if (compressedSize > maxFileSize) {
            // Log warning if file exceeds maximum size (warning log)
            submissionLogger.warn('Compressed file still exceeds the maximum size.');
            return reject(new Error('Compressed file size exceeds the maximum allowed size'));
          }

          // Log success for video compression (information log)
          submissionLogger.info(`Video compressed successfully: ${newOutputFilePath}`);
          // If compressed size is within the limit, promise is resolved
          resolve(newOutputFilePath);
        } catch (err) {
          // Log error when compression fails (error log)
          submissionLogger.error(`Error during compression size check: ${err.message}`, { err });
          reject(err);
        }
      })
      .on('error', (err) => {
        // Log error when compression fails (error log)
        submissionLogger.error(`FFmpeg error during compression: ${err.message}`, { err });
        reject(err);
      })
      .run();
  });
};
 
 
// Check video type and convert to .mp4 if necessary
const convertToMp4 = (filePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputFilePath)
      .videoCodec('libx264')
      .on('end', () => {
        // Log video conversion (information log)
        submissionLogger.info(`Video converted to MP4: ${outputFilePath}`);
        resolve(outputFilePath);
      })
      .on('error', (err) => {
        // Log error when conversion fails (error log)
        submissionLogger.error(`Error during video conversion:`,  err );
        reject(err);
      })
      .run();
  });
};


// Upload video to Nextcloud
const uploadToNextcloud = async (filePath) => {
  const fileName = path.basename(filePath);
  const nextcloudFolder = '/HMS-Video-Uploads';
  const nextcloudPath = `${nextcloudFolder}/${fileName}`;
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
      // Log success if video uploaded (information log)
      submissionLogger.info(`Video uploaded to Nextcloud: ${nextcloudPath}`);
      return `${process.env.NEXTCLOUD_URL}${nextcloudPath}`;
    } else {
      // Log error when upload fails (error log)
      submissionLogger.error('Failed to upload to Nextcloud:', response.status);
      throw new Error('Failed to upload to Nextcloud');
    }
  } catch (error) {
    // Log error when upload fails (error log)
    submissionLogger.error(`Error uploading video to Nextcloud: ${err.message}`, { err });
    if (error.response && error.response.status === 409) {
      throw new Error('File already exists on Nextcloud (Conflict 409)');
    } else {
      throw error;
    }
  }
};
 
 
// Store video metadata (public video link) in MySQL
const storeMetadata = async (req, res, assignmentID, submissionVidName, submissionVidPath ) => {
  try{
    const { userID } = req.user;
 
    const query = 'INSERT INTO submission (assignmentID, userID, submissionVidName, submissionVidPath) VALUES (?, ?, ?, ?)';
 
    await pool.execute(query, [assignmentID, userID, submissionVidName, submissionVidPath]);
    // Log success when metadata stored (information log)
    submissionLogger.info(`Metadata stored for userID: ${userID}, assignmentID: ${assignmentID}`);
  } catch (error) {
    // Log error when metadata storing fails (error log)
    submissionLogger.error(`Error during metadata storing: ${error.message}`, { error });
    if (!res.headersSent) { return res.status(500).json({ message: 'Failed to store metadata', details: error.message }); }
  }
}
 
 
// Retrieve video directly from Nextcloud by URL and return public video link
const getVideoUrl = async (videoId) => {
  const nextcloudFolder = '/HMS-Video-Uploads';
  const videoPath = `${nextcloudFolder}/${videoId}`;
 
  const shareUrl = process.env.NEXTCLOUD_SHARE_URL;
  try {
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
        path: videoPath,  // Use full Nextcloud URL for where video is saved
        shareType: 3,    // Set Public link share type
        permissions: 1,   // Set Read-only permissions
      },
    });

    if (response.data && response.data.ocs && response.data.ocs.data && response.data.ocs.data.url) {
      const publicLink = response.data.ocs.data.url;
      // Log success when public link generated (information log)
      submissionLogger.info(`Public link generated for videoId: ${videoId}`);
      return `${publicLink}/download/${videoId}`;  // Return the public link directly
    } else {
      // Log error when generating public link fails (error log)
      submissionLogger.error('Failed to generate public link');
      return res.status(500).json({ error: 'Failed to generate public link' });
    }
  } catch (error) {
    // Log error when creating public link fails (error log)
    submissionLogger.error(`Error creating public link: ${error.message}`, { error });
    throw new Error(`Failed to create public link: ${error.message}`);
  }
};


// Delete the old video from Nextcloud
const deleteOldVideoFromNextcloud = async (oldVideoPath) => {
  try {
    const response = await axios.delete(`${process.env.NEXTCLOUD_URL}${oldVideoPath}`, {
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
    });
 
    if (response.status === 204) {
      submissionLogger.info(`Successfully deleted old video from Nextcloud: ${oldVideoPath}`);
    } else if (response.status === 404) {
      submissionLogger.warn(`Old video not found in Nextcloud: ${oldVideoPath}`);
      // Decide whether to throw an error here or simply continue
    } else {
      throw new Error('Unexpected response from Nextcloud during deletion');
    }
  } catch (error) {
    submissionLogger.error(`Error deleting old video from Nextcloud: ${error.message}`, { error });
    throw new Error(`Failed to delete old video: ${error.message}`);
  }
};
 
 
// Update video metadata in MySQL
const updateMetadata = async (req, res, assignmentID, newVideoId, publicLink) => {
  try {
    const { userID } = req.user;
 
    const query = 'UPDATE submission SET submissionVidName = ?, submissionVidPath = ? WHERE assignmentID = ? AND userID = ?';
 
    await pool.execute(query, [newVideoId, publicLink, assignmentID, userID]);
    // Log success when video metadata updated
    submissionLogger.info(`Successfully updated video metadata for assignmentID: ${assignmentID}, userID: ${userID}, newVideoId: ${newVideoId}`); 
  } catch (error) {
    // Log error when updating metadata fails (error log)
    submissionLogger.error(`Error during metadata update for assignmentID: ${assignmentID}, userID: ${userID}, newVideoId: ${newVideoId}. Error: ${error.message}`, { error }); 
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Failed to update metadata', details: error.message });
    }
  }
};
 



// Main function to handle video upload and compression
export const uploadVideo = (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Log error when file upload fails (error log)
      submissionLogger.error(`File upload error: ${err.message}`, { err });
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      // Log error when file upload fails (error log)
      submissionLogger.error(`Unexpected error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }
 
    if (!req.file) {
      // Log warning when no file is uploaded (warning log)
      submissionLogger.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    // Extract assignmentID from the request body
    const { assignmentID } = req.body;
 
    if (!assignmentID) {
      // Log warning for missing field (warning log)
      submissionLogger.warn('Assignment ID is required');
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
 
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const ext = path.extname(filePath).toLowerCase();  // Get file extension for extension type check
    let finalFilePath = filePath;
    let videoId;
 
    try {
      // If file is not .mp4, then convert it to .mp4
      if (ext !== '.mp4') {
        const mp4FilePath = `uploads/${path.basename(filePath, path.extname(filePath))}.mp4`;
        finalFilePath = await convertToMp4(filePath, mp4FilePath);
        // Log file conversion (information log)
        submissionLogger.info(`Converting file: ${filePath} to MP4 format.`);
        fs.unlinkSync(filePath);  // Delete the original non-mp4 file after conversion
        // Log original file deletion (information log)
        submissionLogger.info(`Deleted original file: ${filePath}`);
      }
 
      // If the file exceeds the maximum allowed size, then compress it
      if (fileSize > MAX_FILE_SIZE) {
        // Log convertion to .mp4 (information log)
        submissionLogger.info(`Converting file to .mp4: ${filePath}`);
        const compressedFilePath = `uploads/${path.basename(filePath, path.extname(filePath))}.mp4`;
        finalFilePath = await compressVideo(filePath, compressedFilePath, MAX_FILE_SIZE);
 
        // Delete the original file after successful compression
        fs.unlinkSync(filePath);
        // Log success for compression (information log)
        submissionLogger.info(`Compression complete. New file path: ${finalFilePath}`);
      }
 
      // Upload the (compressed or original) video to Nextcloud and get link returned
      const nextcloudUrl = await uploadToNextcloud(finalFilePath);
 
      videoId = path.basename(nextcloudUrl); // Get the videoId from the nextcloudUrl
      // Log success for uploading video (information log)
      submissionLogger.info(`Uploaded video to Nextcloud. videoId: ${videoId}, nextcloudUrl: ${nextcloudUrl}`);
      // Get public link
      const publicLink = await getVideoUrl(videoId);
      // Log success for public link generation (information og)
      submissionLogger.info(`Generated public link: ${publicLink}`);
      // Store video metadata in the database, including assignmentID
      await storeMetadata(req, res, assignmentID, videoId, publicLink);
      // Log success for stored metadata (information log)
      submissionLogger.info(`Stored video metadata for assignmentID: ${assignmentID}, videoId: ${videoId}`);
      // Delete the local file after uploading to Nextcloud
      fs.unlinkSync(finalFilePath);

      // log success for deletion of local file (information log)
      submissionLogger.info(`Local file deleted: ${finalFilePath}`);
      
      res.status(200).json({ message: 'File uploaded successfully', publicLink });
      // Log success for file upload (information log)
      submissionLogger.info(`File upload successful for assignmentID: ${assignmentID}. Public link: ${publicLink}`);
    } catch (error) {
      // Log error when video processing fails (error log)
      submissionLogger.error(`Error during video processing: ${error.message}`, { error });
      res.status(500).json({ message: 'Failed to process video', details: error.message });
    } finally {
      // Ensures that local file is always cleaned up
      if (fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
        // Log success when local file cleaned (information log)
        submissionLogger.info(`Cleaned up local file: ${finalFilePath}`);
      }
    }
  });
};
 



// Main function to handle video update
export const updateVideo = (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Log error when file upload fails (error log)
      submissionLogger.error(`File upload error: ${err.message}`, { err });
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      // Log error when file upload fails unexpectedly (error log)
      submissionLogger.error(`Unexpected error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }
 
    if (!req.file) {
      // Log warning for no file uploaded (warning log)
      submissionLogger.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    // Extract assignmentID and oldVideoName from the request body
    const { assignmentID, oldVideoName } = req.body;
 
    if (!assignmentID) {
      // Log warning for missing fields (warning log)
      submissionLogger.warn('Assignment ID is required');
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
 
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const ext = path.extname(filePath).toLowerCase();  // Get file extension for extension type check
    let finalFilePath = filePath;
    let newVideoId;
 
    try {
      const { userID } = req.user;
 
      // Retrieve the old video name from the database
      const query = 'SELECT submissionVidName FROM submission WHERE assignmentID = ? AND userID = ?';
      console.log('Running query with:', assignmentID, userID);
      const [rows] = await pool.execute(query, [assignmentID, userID]);
 
      if (rows.length === 0) {
        // Log warning for no video found (warning log)
        submissionLogger.warn(`No video found for assignmentID: ${assignmentID} and userID: ${userID}`);
        return res.status(404).json({ message: 'No video found for the given assignment ID' });
      }
 
      const oldVideoName = rows[0].submissionVidName; // Get the old video name
      // Log success for old video found (informatuon log)
      submissionLogger.info(`Found old video: ${oldVideoName}`);
      // Check if the old video exists in Nextcloud and delete it
      const oldVideoPath = `/HMS-Video-Uploads/${oldVideoName}`;
      await deleteOldVideoFromNextcloud(oldVideoPath);
      // Log success for old video deletion (information log)
      submissionLogger.info(`Deleted old video from Nextcloud: ${oldVideoPath}`);
      // If file is not .mp4, convert it to .mp4
      if (ext !== '.mp4') {
        const mp4FilePath = `uploads/${path.basename(filePath, path.extname(filePath))}.mp4`;
        finalFilePath = await convertToMp4(filePath, mp4FilePath);
        fs.unlinkSync(filePath);  // Delete the original non-mp4 file after conversion
        // Log success for file conversion (information log)
        submissionLogger.info(`Converted file to .mp4: ${finalFilePath}`);
      }
 
      // If the file exceeds the maximum allowed size, then compress it
      if (fileSize > MAX_FILE_SIZE) {
        const compressedFilePath = `uploads/${path.basename(filePath, path.extname(filePath))}.mp4`;
        finalFilePath = await compressVideo(finalFilePath, compressedFilePath, MAX_FILE_SIZE);
 
        // Delete the original file after successful compression
        fs.unlinkSync(filePath);
        // Log success for file compression (information log)
        submissionLogger.info(`Compressed file: ${finalFilePath}`);
      }
 
      // Upload the (compressed or original) video to Nextcloud and get link returned
      const nextcloudUrl = await uploadToNextcloud(finalFilePath);
 
      newVideoId = path.basename(nextcloudUrl); // Get the new videoId from the nextcloudUrl
      // Log success for uploaded video (information log)
      submissionLogger.info(`Uploaded new video to Nextcloud: ${nextcloudUrl}`);

      const publicLink = await getVideoUrl(newVideoId);
      // Log success for public link generation (information log)
      submissionLogger.info(`Generated public link: ${publicLink}`);

      // Update video metadata in the database
      await updateMetadata(req, res, assignmentID, newVideoId, publicLink);
      // Log success for metadata update (information log)
      submissionLogger.info(`Updated metadata for assignmentID: ${assignmentID}, newVideoId: ${newVideoId}`);

      // Delete the local file after uploading to Nextcloud
      fs.unlinkSync(finalFilePath);
      // Log success for deletion of local file (information log)
      submissionLogger.info(`Deleted local file: ${finalFilePath}`);
      
      res.status(200).json({ message: 'File updated successfully', publicLink });
      // Log success for file update (information log)
      submissionLogger.info(`File update successful for assignmentID: ${assignmentID}. Public link: ${publicLink}`);

    } catch (error) {
      // Log error when video update fails (error log)
      submissionLogger.error(`Error during video update: ${error.message}`, { error });
      res.status(500).json({ message: 'Failed to update video', details: error.message });
    } finally {
      // Ensures that local file is always cleaned up
      if (fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
        // Log success when local file cleaned (information log)
        submissionLogger.info(`Cleaned up local file: ${finalFilePath}`);
      }
    }
  });
};
