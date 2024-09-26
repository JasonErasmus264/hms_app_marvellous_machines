import bcrypt from 'bcryptjs';
import multer from 'multer';  // For file uploads
import sharp from 'sharp';  // For image conversion
import fs from 'fs';  // For file system operations
import path from 'path';  // For file path operations
import axios from 'axios';  // For Nextcloud upload
import pool from '../db.js';
import 'dotenv/config';



import { userLogger } from '../middleware/logger.js'; // Import user logger

export const getUser = async (req, res) => {
  try {
    const { userID } = req.user; // Extract userID from JWT

    // Fetch the user's data including createdAt and phoneNum fields
    const [rows] = await pool.execute(
      'SELECT username, firstName, lastName, email, phoneNum, userType, createdAt FROM users WHERE userID = ?',
      [userID]
    );

    if (rows.length === 0) {
      // Log a warning if user not found (warning log)
      userLogger.warn(`User not found: ${userID}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    
    // Format the createdAt field to the desired format (e.g., "July 12th, 2023")
    const formattedCreatedAt = formatDate(new Date(user.createdAt));

    // Log success if user details recieved (information log)
    userLogger.info(`User details retrieved successfully for userID: ${userID}`);

    // Return the user's data including the formatted createdAt and phoneNum
    res.json({
      user: {
        ...user,
        createdAt: formattedCreatedAt, // Include the formatted createdAt
      },
    });
  } catch (error) {
    // Log error when retrieving user fails (error log)
    userLogger.error(`Error retrieving user: ${error.message}`, {error});
    res.status(500).json({ error: error.message });
  }
};

// Function to format dates to 'July 12th, 2023'
const formatDate = (date) => {
  const options = {
    day: 'numeric',
    month: 'long', // Full month name
    year: 'numeric',
  };

  const day = date.getDate();
  const ordinalDay = getOrdinalSuffix(day);
  
  // Format the date (e.g., "July 12th, 2023")
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate.replace(day, `${ordinalDay}`);
};

// Helper function to get the ordinal suffix (st, nd, rd, th)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return `${day}th`; // Teens are always "th"
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};








// Update current user's info
export const updateUser = async (req, res) => {
  const { userID } = req.user; // Extract userID from JWT
  const { firstName, lastName, phoneNum } = req.body;

  try {
    const [rows] = await pool.execute('SELECT username FROM users WHERE userID = ?', [userID]);

    if (rows.length === 0) {
      // Log a warning if user not found (warning log)
      userLogger.warn(`User not found for update: ${userID}`);
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.execute(
      'UPDATE users SET firstName = ?, lastName = ?, phoneNum = ? WHERE userID = ?',
      [firstName, lastName, phoneNum, userID]
    );

    // Log success if user updated (information log)
    userLogger.info(`User: ${userID} updated successfully`);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    // Log error when updating user fails (error log)
    userLogger.error(`Error updating user: ${error.message}`, {error});
    res.status(500).json({ error: error.message });
  }
};







// Function to handle password change request
export const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword, confirmPassword } = req.body;
  const { userID } = req.user; // Get userID from the logged-in user

  // Strong password validation (at least 8 characters, one uppercase, one lowercase, one number, one special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  try {
    // Check if all fields are filled
    if (!username || !currentPassword || !newPassword || !confirmPassword) {
      // Log a warning if missing required fields (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, all fields are required`)
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      // Log a warning if passwords don't match (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, new password and confirm password do not match`);
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Validate the new password using the regex
    if (!passwordRegex.test(newPassword)) {
      // Log a warning if requirements not met (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, new password does not meet requirements`);
      return res.status(400).json({
        message: 'New password must be at least 8 characters, contain one uppercase, one lowercase, one number, and one special character.'
      });
    }

    // Verify the username matches the userID
    const [userRows] = await pool.execute('SELECT username, password FROM users WHERE userID = ?', [userID]);
    const user = userRows[0];

    if (!user) {
      // Log a warning if user not found (warning log)
      userLogger.warn(`User not found for password change: ${userID}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided username matches the username in the database
    if (user.username !== username) {
      // Log a warning if username doesn't match (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, username does not match the authenticated user`);
      return res.status(401).json({ message: 'Username does not match the authenticated user' });
    }

    // Compare the old password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // Log a warning if current password incorrect (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, current password is incorrect`);
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if the new password is the same as the old password
    if (await bcrypt.compare(newPassword, user.password)) {
      // Log a warning if new password is same as old password (warning log)
      userLogger.warn(`Password change request failed for userID: ${userID}, new password cannot be the same as the old password`);
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await pool.execute('UPDATE users SET password = ? WHERE userID = ?', [hashedNewPassword, userID]);

    // Log success if password updated (information log)
    userLogger.info(`Password updated successfully for userID: ${userID}`);

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    // Log error when changing password fails (error log)
    userLogger.error(`Error changing password: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};










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
 
 
// Store picture metadata (public picture link) in MySQL
const storeMetadata = async (req, res, pictureLink) => {
    try {
      const { userID } = req.user;
 
      // Check if pictureLink and userID are defined
      if (!userID) {
        throw new Error('Invalid user ID');
      }
 
      const query = 'UPDATE users SET profilePicture = ? WHERE userID = ?';
      await pool.execute(query, [pictureLink, userID]);
 
    } catch (error) {
      console.error('Error during metadata storing:', error);
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
      return `${publicLink}/download/${pictureId}`;  // Return the public link directly
    } else {
      throw new Error('Failed to generate public link for profile picture');
    }
  } catch (error) {
    console.error('Error creating public link:', error);
    throw new Error(`Failed to create public link: ${error.message}`);
  }
};
 
 
 







// Main function to handle profile picture upload and conversion
export const uploadProfilePicture = (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }

    if (!req.file) {
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
      }

      // Upload the JPEG profile picture to Nextcloud and get link returned
      const nextcloudUrl = await uploadToNextcloud(finalFilePath);

      const pictureId = path.basename(nextcloudUrl); // Get the pictureId (name) from the nextcloudUrl

      // Get public link using the pictureId
      const publicLink = await getProfilePictureUrl(pictureId);

      // Store the public link in the database
      await storeMetadata(req, res, publicLink);

      // Delete the local file after uploading to Nextcloud
      fs.unlinkSync(finalFilePath);

      if (!res.headersSent) {
      res.status(200).json({ message: 'Profile picture uploaded successfully', publicLink });
      }
    } catch (error) {
      console.error('Error during profile picture upload:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to upload profile picture', details: error.message });
      }
    } finally {
      // Ensure that local file is always cleaned up
      if (fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
      }
    }
  });
};