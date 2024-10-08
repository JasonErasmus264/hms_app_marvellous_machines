import multer from 'multer';  // For file uploads
import sharp from 'sharp';  // For image conversion
import fs from 'fs';  // For file system operations
import path from 'path';  // For file path operations
import axios from 'axios';  // For Nextcloud upload
import pool from '../db.js';
import 'dotenv/config';

 
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
 
// Check image type and convert to .jpeg if necessary
const convertToJpeg = async (filePath, outputFilePath) => {
  return sharp(filePath)
    .jpeg({ quality: 80 })
    .toFile(outputFilePath);
};
 
// Upload image to Nextcloud
const uploadToNextcloud = async (filePath) => {
  const fileName = path.basename(filePath);
  const nextcloudFolder = '/HMS-Profile-Picture-Uploads/User-Profiles';
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
        // Log successful upload  (information log)
        profileLogger.info(`Successfully uploaded ${fileName} to Nextcloud`);
      return `${process.env.NEXTCLOUD_URL}${nextcloudPath}`;
    } else {
        // Log error when upload fails (error log)
        profileLogger.error('Failed to upload to Nextcloud');
      throw new Error('Failed to upload to Nextcloud');
    }
  } catch (error) {
    // Log error when upload fails (error log)
    profileLogger.error(`Error uploading file to Nextcloud: ${error.message}`, { error });
    if (error.response && error.response.status === 409) {
      throw new Error('File already exists on Nextcloud (Conflict 409)');
    } else {
      throw error;
    }
  }
};
 
 
// Store picture metadata (public picture link) in MySQL
const storeMetadata = async (req, res, pictureLink) => {
    try {
      const { userID } = req.user;
 
      // Check if pictureLink and userID are defined
      if (!userID) {
        // Log warning for invalid userID (warning log)
        profileLogger.warn(`Invalid userID: ${userID}`)
        throw new Error('Invalid user ID');
      }
 
      const query = 'UPDATE users SET profilePicture = ? WHERE userID = ?';
      await pool.execute(query, [pictureLink, userID]);
      // Log success for updated profile picture (information log)
      profileLogger.info(`Updated profile picture for userID: ${userID}`);
    } catch (error) {
        // Log error when storing metadata fails 
        profileLogger.error(`Error during metadata storing: ${error.message}`, { error });
      if (!res.headersSent) { return res.status(500).json({ message: 'Failed to store metadata', details: error.message }); }
    }
  };
 
 
 
// Retrieve image directly from Nextcloud by URL and return public image link
const getProfilePictureUrl = async (pictureId) => {
  const nextcloudFolder = '/HMS-Profile-Picture-Uploads/User-Profiles';
  const picturePath = `${nextcloudFolder}/${pictureId}`;
 
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
        path: picturePath,
        shareType: 3,
        permissions: 1,
      },
    });
 
    if (response.data && response.data.ocs && response.data.ocs.data && response.data.ocs.data.url) {
      const publicLink = response.data.ocs.data.url;
      // Log success for public link generation (information log)
      profileLogger.info(`Generated public link for pictureId: ${pictureId}`);
      return `${publicLink}/download/${pictureId}`;  // Return the public link directly
    } else {
        // Log error when public link generation fails (error log)
        profileLogger.error('Failed to generate public link for profile picture');
      throw new Error('Failed to generate public link for profile picture');
    }
  } catch (error) {
    // Log error when public link creation fails (error log)
    profileLogger.error(`Error creating public link: ${error.message}`, { error });
    throw new Error(`Failed to create public link: ${error.message}`);
  }
};
 
 
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main function to handle profile picture upload and conversion
export const uploadProfilePicture = (req, res) => {
    upload.single('profilePicture')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Log error if file upload fails (error log)
        profileLogger.error(`Multer error during file upload: ${error.message}, { error }`);
        return res.status(500).json({ message: 'File upload error', details: err.message });
      } else if (err) {
        // Log error if file upload fails unexpectedly (error log)
        profileLogger.error(`Unexpected error during file upload: ${err.message}`, { err });
        return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
      }
 
      if (!req.file) {
        // Log warning for no file uploaded (warning log)
        profileLogger.warn('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
      }
 
 
      const filePath = req.file.path;
      const ext = path.extname(filePath).toLowerCase();
      let finalFilePath = filePath;
 
      try {
        // Convert to JPEG if not already a JPEG
        if (ext !== '.jpeg' && ext !== '.jpg') {
          const jpegFilePath = `uploads/${path.basename(filePath, path.extname(filePath))}.jpeg`;
          await convertToJpeg(filePath, jpegFilePath);
          finalFilePath = jpegFilePath;
          fs.unlinkSync(filePath);  // Delete the original non-JPEG file after conversion
          // Log success for file conversion (information log)
          profileLogger.info(`Converted ${filePath} to JPEG format`);
        }
 
        // Upload the JPEG profile picture to Nextcloud and get link returned
        const nextcloudUrl = await uploadToNextcloud(finalFilePath);
 
        const pictureId = path.basename(nextcloudUrl); // Get the pictureId (name) from the nextcloudUrl
        
        // Get public link using the pictureId
        const publicLink = await getProfilePictureUrl(pictureId);
        // Log success for public link generation (information log)
        profileLogger.info(`Generated public link for profile picture: ${publicLink}`);

        // Store the public link in the database
        await storeMetadata(req, res, publicLink);
        // log success for public link stored (information log )
        profileLogger.info('Stored public link in the database');
        
        // Delete the local file after uploading to Nextcloud
        fs.unlinkSync(finalFilePath);
        // Log success for local file deletion (information log)
        submissionLogger.info(`Deleted local file after upload: ${finalFilePath}`);
 
        if (!res.headersSent) {
            // log success for uploaded profile picture (information log)
            profileLogger.info(`Profile picture uploaded successfully: ${publicLink}`);
        res.status(200).json({ message: 'Profile picture uploaded successfully', publicLink });
        }
      } catch (error) {
        // Log error if profile picture upload fails (error log)
        profileLogger.error(`Error during profile picture upload: ${error.message}`, { error });
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to upload profile picture', details: error.message });
        }
      } finally {
        // Ensure that local file is always cleaned up
        if (fs.existsSync(finalFilePath)) {
          fs.unlinkSync(finalFilePath);
          // Log success for file cleaned (information log)
          profileLogger.info(`Cleaned up local file: ${finalFilePath}`);
        }
      }
    });
  };