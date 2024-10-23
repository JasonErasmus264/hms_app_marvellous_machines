import bcrypt from 'bcryptjs';  // For password hashing
import multer from 'multer';  // For file uploads
import gm from 'gm'; // For image conversions
import fs from 'fs';  // For file system operations
import fsExtra from 'fs-extra'; // For converting image to base64 data uri
import pool from '../db.js';  // Importing database connection pool
import 'dotenv/config';  // Load environment variables

import { userLogger } from '../middleware/logger.js'; // Import user logger
import { DEFAULT_PROFILE_PIC } from '../constants.js';

// Get current user's info
export const getUser = async (req, res) => {
  try {
    const { userID } = req.user; // Extract userID from JWT

    // Fetch the user's data including createdAt and phoneNum fields
    const [rows] = await pool.execute(
      'SELECT username, firstName, lastName, email, phoneNum, userType, createdAt, profilePicture FROM users WHERE userID = ?',
      [userID]
    );

    if (rows.length === 0) {
      // Log a warning if user not found (warning log)
      userLogger.warn(`User not found: ${userID}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Check if profilePicture is null and set a default profile picture base64 if it is 
    //(We had to do it this way as because it is so long we had to use the TEXT datatype and that does not support the default command)
    const profilePic = user.profilePicture || DEFAULT_PROFILE_PIC; // Use the imported constant (Like this because it is very long)

    // Format the createdAt field to the desired format (e.g., "July 12th, 2023")
    const formattedCreatedAt = formatDate(new Date(user.createdAt));

    // Fetch the count of notifications for the user
    const [notificationCountRows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM notification WHERE userID = ?',
      [userID]
    );

    const notificationCount = notificationCountRows[0].count;

    // Log success if user details received (information log)
    userLogger.info(`User details retrieved successfully for userID: ${userID}`);

    // Return the user's data including the formatted createdAt, phoneNum, and notification count
    res.json({
      user: {
        ...user,
        profilePicture: profilePic, // Use the modified profilePic value
        createdAt: formattedCreatedAt, // Include the formatted createdAt
        notificationCount: notificationCount, // Include notification count
      },
    });
  } catch (error) {
    // Log error when retrieving user fails (error log)
    userLogger.error(`Error retrieving user: ${error.message}`, { error });
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










/*// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  // Log creation of directory (information log)
  userLogger.info('Uploads directory created');
}
 
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    userLogger.info(`File received for upload: ${file.originalname}`);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
 
const upload = multer({ storage });

// Check image type and convert to .jpeg if necessary
const convertToJpeg = async (filePath, outputFilePath) => {
  try {
    // Convert image to.jpeg
    return new Promise((resolve, reject) => {
    gm(filePath)
      .setFormat('jpeg')
      .quality(80)
      .write(outputFilePath, (err) => {
        if (err) {
          return reject(new Error(`Image conversion failed: ${err.message}`));
        }
        resolve(outputFilePath);
      });
    });
    
  } catch (error) {
    throw new Error(`Conversion process encountered an issue: ${error.message}`);
  }
};

// Store picture metadata (public picture link) in MySQL
const storeMetadata = async (req, res, pictureLink) => {
  try {
    const { userID } = req.user;

    // Check if pictureLink and userID are defined
    if (!userID) {
      // Log warning for invalid userID (warning log)
      userLogger.warn(`Invalid userID: ${userID}`)
      throw new Error('Invalid user ID');
    }

    const query = 'UPDATE users SET profilePicture = ? WHERE userID = ?';
    await pool.execute(query, [pictureLink, userID]);
    // Log success for updated profile picture (information log)
    userLogger.info(`Updated profile picture for userID: ${userID}`);
  } catch (error) {
    // Log error when storing metadata fails 
    userLogger.error(`Error during metadata storing: ${error.message}`, { error });
    if (!res.headersSent) { return res.status(500).json({ message: 'Failed to store metadata', details: error.message }); }
  }
};



// Main function to handle profile picture upload and conversion to base64
// Main function to handle profile picture upload and conversion to base64
export const uploadProfilePicture = (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      userLogger.error(`Multer error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      userLogger.error(`Unexpected error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }

    if (!req.file) {
      userLogger.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const jpegFilePath = `uploads/${Date.now()}.jpeg`; // Define path for the converted JPEG file

    try {
      // Step 1: Convert uploaded image to JPEG
      await convertToJpeg(filePath, jpegFilePath);

      // Step 2: Read the converted JPEG file and convert to base64
      const base64String = await fsExtra.readFile(jpegFilePath, { encoding: 'base64' });

      // Step 3: Ensure that the base64 string is properly prefixed
      const base64Image = `data:image/jpeg;base64,${base64String}`;

      // Step 4: Store the base64 string in the database as metadata
      await storeMetadata(req, res, base64Image);

      // Optionally: Clean up the uploaded file after converting
      fs.unlinkSync(jpegFilePath); // Delete the converted JPEG file
      userLogger.info(`Deleted local JPEG file after base64 conversion: ${jpegFilePath}`);

      if (!res.headersSent) {
        userLogger.info('Profile picture uploaded and converted to base64 successfully');
        res.status(200).json({
          message: 'Profile picture uploaded successfully',
          base64String: base64Image, // Send the properly formatted base64 string back to the client
        });
      }
    } catch (error) {
      userLogger.error(`Error during profile picture upload: ${error.message}`, { error });
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to upload profile picture', details: error.message });
      }
    } finally {
      // Clean up the original uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        userLogger.info(`Cleaned up original uploaded file: ${filePath}`);
      }

      // Clean up the converted JPEG file (if not already deleted)
      if (fs.existsSync(jpegFilePath)) {
        fs.unlinkSync(jpegFilePath);
        userLogger.info(`Cleaned up converted JPEG file: ${jpegFilePath}`);
      }
    }
  });
};*/






import { exec } from 'child_process'; // Add this import at the top

import imagemagick from 'imagemagick';

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  userLogger.info('Uploads directory created');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    userLogger.info(`File received for upload: ${file.originalname}`);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Check image type and convert to .jpeg if necessary
const convertToJpeg = async (filePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `magick convert ${filePath} -quality 80 ${outputFilePath}`;
    
    exec(command, (err) => {
      if (err) {
        return reject(new Error(`Image conversion failed: ${err.message}`));
      }
      resolve(outputFilePath);
    });
  });
};

// Store picture metadata (public picture link) in MySQL
const storeMetadata = async (req, res, pictureLink) => {
  try {
    const { userID } = req.user;

    if (!userID) {
      userLogger.warn(`Invalid userID: ${userID}`);
      throw new Error('Invalid user ID');
    }

    const query = 'UPDATE users SET profilePicture = ? WHERE userID = ?';
    await pool.execute(query, [pictureLink, userID]);
    userLogger.info(`Updated profile picture for userID: ${userID}`);
  } catch (error) {
    userLogger.error(`Error during metadata storing: ${error.message}`, { error });
    if (!res.headersSent) { return res.status(500).json({ message: 'Failed to store metadata', details: error.message }); }
  }
};

// Main function to handle profile picture upload and conversion to base64
export const uploadProfilePicture = (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      userLogger.error(`Multer error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'File upload error', details: err.message });
    } else if (err) {
      userLogger.error(`Unexpected error during file upload: ${err.message}`, { err });
      return res.status(500).json({ message: 'Unexpected error during file upload', details: err.message });
    }

    if (!req.file) {
      userLogger.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const jpegFilePath = `uploads/${Date.now()}.jpeg`; // Define path for the converted JPEG file

    try {
      // Step 1: Convert uploaded image to JPEG
      await convertToJpeg(filePath, jpegFilePath);

      // Step 2: Read the converted JPEG file and convert to base64
      const base64String = await fsExtra.readFile(jpegFilePath, { encoding: 'base64' });

      // Step 3: Ensure that the base64 string is properly prefixed
      const base64Image = `data:image/jpeg;base64,${base64String}`;

      // Step 4: Store the base64 string in the database as metadata
      await storeMetadata(req, res, base64Image);

      // Optionally: Clean up the uploaded file after converting
      fs.unlinkSync(jpegFilePath); // Delete the converted JPEG file
      userLogger.info(`Deleted local JPEG file after base64 conversion: ${jpegFilePath}`);

      if (!res.headersSent) {
        userLogger.info('Profile picture uploaded and converted to base64 successfully');
        res.status(200).json({
          message: 'Profile picture uploaded successfully',
          base64String: base64Image, // Send the properly formatted base64 string back to the client
        });
      }
    } catch (error) {
      userLogger.error(`Error during profile picture upload: ${error.message}`, { error });
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to upload profile picture', details: error.message });
      }
    } finally {
      // Clean up the original uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        userLogger.info(`Cleaned up original uploaded file: ${filePath}`);
      }

      // Clean up the converted JPEG file (if not already deleted)
      if (fs.existsSync(jpegFilePath)) {
        fs.unlinkSync(jpegFilePath);
        userLogger.info(`Cleaned up converted JPEG file: ${jpegFilePath}`);
      }
    }
  });
};