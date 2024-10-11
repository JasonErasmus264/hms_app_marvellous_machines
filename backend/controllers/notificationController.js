import nodemailer from 'nodemailer';
import pool from '../db.js'; // Database connection
import { notificationLogger } from '../middleware/logger.js';



// Function to get notifications
export const getNotification = async (req, res) => {
    const { userID } = req.user; // Get userID from the authenticated user (the lecturer)
  
    try {
      // Fetch notifications for the lecturer based on userID, including notificationID
      const [notifications] = await pool.execute(
        'SELECT notificationID, message, createdAt FROM notification WHERE userID = ? ORDER BY createdAt DESC',
        [userID]
      );
  
      // Check if notifications exist
      if (notifications.length === 0) {
        notificationLogger.info(`No notifications found for user ${userID}`);
        return res.status(404).json({ message: 'No notifications found' });
      }
  
      // Format the notifications with timestamp
      const formattedNotifications = notifications.map(notification => {
        const { notificationID, message, createdAt } = notification;
  
        // Format the timestamp
        const timestamp = new Date(createdAt);
        const options = {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
        const formattedTimestamp = timestamp.toLocaleString('en-GB', options).replace(',', ' at');
  
        return {
          notificationID, // Include notificationID
          message,
          timestamp: formattedTimestamp, // Format: day full month name, hour:minute
        };
      });
    
  
      // Respond with the formatted notifications
      res.json({ notifications: formattedNotifications });
    } catch (error) {
      // Log error if fetching notifications fails
      notificationLogger.error(`Error fetching notifications for user ${userID}: ${error.message}`, { error });
      res.status(500).json({ message: 'An error occurred while fetching notifications' });
    }
};





// Add notification and send email to lecturer
export const submissionNotification = async (req, res) => {
    const { assignmentID } = req.params; // Get assignmentID from URL parameters
    const { userID } = req.user; // Get userID from authenticated user (the student)
  
    // Ensure assignmentID is provided
    if (!assignmentID) {
      // Log warning for missing required fields (warning log)
      notificationLogger.warn('Missing required field: assignmentID');
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
  
    try {
      // Get the assignment details to fetch lecturer's userID and assignment name
      const [assignment] = await pool.execute(
        `SELECT userID AS lecturerID, assignName 
         FROM assignment 
         WHERE assignmentID = ?`,
        [assignmentID]
      );
  
      if (assignment.length === 0) {
        // Log warning if assignment not found (warning log)
        notificationLogger.warn(`Assignment with ID ${assignmentID} not found`);
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      const { lecturerID, assignName } = assignment[0];
  
      // Fetch lecturer's email from users table
      const [lecturer] = await pool.execute(
        'SELECT firstName, lastName, email FROM users WHERE userID = ?',
        [lecturerID]
      );
  
      if (lecturer.length === 0) {
        // Log warning if lecturer not found (warning log)
        notificationLogger.warn(`Lecturer with ID ${lecturerID} not found`);
        return res.status(404).json({ message: 'Lecturer not found' });
      }
  
      const { email: lecturerEmail, firstName, lastName } = lecturer[0];
  
      // Get the student's details (the one who submitted)
      const [student] = await pool.execute(
        'SELECT firstName, lastName, username FROM users WHERE userID = ?',
        [userID]
      );
  
      if (student.length === 0) {
        // Log warning if student not found (warning log)
        notificationLogger.warn(`Student with ID ${userID} not found`);
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const { firstName: studentFirstName, lastName: studentLastName, username } = student[0];
  
      // Create the notification message
      const message = `${studentFirstName} ${studentLastName} (${username}) has submitted for ${assignName}.`;
  
      // Insert the notification into the notifications table
      const result = await pool.execute(
        'INSERT INTO notification (userID, message) VALUES (?, ?)',
        [lecturerID, message]
      );
  
      // Setup email transporter (Gmail configuration)
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // HTML email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: lecturerEmail, // Send email to the lecturer
        subject: `New Submission for ${assignName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Assignment Submission</h2>
            <p style="font-size: 16px; color: #555;">Dear ${firstName} ${lastName},</p>
            <p style="font-size: 16px; color: #555;">A new submission has been made for the following assignment:</p>
            <blockquote style="border-left: 4px solid #4CAF50; padding-left: 15px; color: #555; font-style: italic;">
                <strong>Assignment Name:</strong> ${assignName}<br>
                <strong>Submitted By:</strong> ${studentFirstName} ${studentLastName} (${username})
            </blockquote>
            <p style="font-size: 16px; color: #555;">Kindly review the submission at your earliest convenience.</p>
            <p style="font-size: 16px; color: #555;">Thank you,<br>Your Submission System</p>
            </div>
        `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Log success for adding notification and sending email (information log)
      notificationLogger.info('Notification added and email sent successfully', { notificationID: result[0].insertId });
      res.status(201).json({ message: 'Notification sent successfully and email dispatched'});
  
    } catch (error) {
      // Log error if adding notification or sending email fails (error log)
      notificationLogger.error(`Error adding notification or sending email: ${error.message}`, { error });
      res.status(500).json({ message: 'Internal server error' });
    }
};




// Function to delete a notification
export const deleteNotification = async (req, res) => {
    const { notificationID } = req.params; // Get notificationID from the URL parameters
    const { userID } = req.user; // Get userID from the authenticated lecturer
  
    // Ensure notificationID is provided
    if (!notificationID) {
      notificationLogger.warn('Notification ID is required for deletion');
      return res.status(400).json({ message: 'Notification ID is required' });
    }
  
    try {
      // Check if the notification exists before trying to delete
      const [existingNotification] = await pool.execute(
        'SELECT notificationID FROM notification WHERE notificationID = ? AND userID = ?',
        [notificationID, userID]
      );
  
      if (existingNotification.length === 0) {
        notificationLogger.warn(`Notification ${notificationID} not found or user ${userID} does not have permission to delete it`);
        return res.status(404).json({ message: 'Notification not found or you do not have permission to delete it' });
      }
  
      // Delete the notification
      await pool.execute('DELETE FROM notification WHERE notificationID = ?', [notificationID]);
  
      // Log success for deletion (information log)
      notificationLogger.info(`Notification ${notificationID} deleted successfully by user ${userID}`);
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      // Log error if deletion fails
      notificationLogger.error(`Error deleting notification: ${error.message}`, { error });
      res.status(500).json({ message: 'An error occurred while deleting the notification' });
    }
};