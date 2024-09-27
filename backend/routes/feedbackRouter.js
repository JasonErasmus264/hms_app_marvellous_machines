import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import {addFeedback, updateFeedback, deleteFeedback, getStudentMarksByUserAndModule, downloadMarks } from '../controllers/feedbackController.js';

const feedbackRoute = express.Router();

// All routes should check for a valid token
feedbackRoute.use(verifyToken);

// Get student feedback
feedbackRoute.get('/v1/feedback/:moduleID/:userID', getStudentMarksByUserAndModule);

// Add feedback (Admins or Lecturers)
feedbackRoute.post('/v1/feedback', authorizeRoles('Admin', 'Lecturer'), addFeedback);

// Update feedback (Admins or Lecturers)
feedbackRoute.put('/v1/feedback/:feedbackID', authorizeRoles('Admin', 'Lecturer'), updateFeedback);

// Delete feedback (Admins or Lecturers)
feedbackRoute.delete('/v1/feedback/:feedbackID', authorizeRoles('Admin', 'Lecturer'), deleteFeedback);





// Route for downloading commentary in specific format
feedbackRoute.get('/v1/download-marks/:assignmentID/:format', downloadMarks);





export default feedbackRoute;