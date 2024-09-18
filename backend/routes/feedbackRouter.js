import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getStudentMarksByUserAndModule, downloadMarks } from '../controllers/feedbackController.js';

const feedbackRoute = express.Router();

// All routes should check for a valid token
feedbackRoute.use(verifyToken);

// GET STUDENT MARKS BASED ON MODULE ID AND USER ID
feedbackRoute.get('/v1/feedback/:moduleID/:userID', getStudentMarksByUserAndModule);

// Route for downloading commentary in specific format
feedbackRoute.get('/v1/download-commentary/:assignmentID/:format', downloadMarks);



feedbackRoute.get('/v1/download-marks', downloadMarks);



export default feedbackRoute;