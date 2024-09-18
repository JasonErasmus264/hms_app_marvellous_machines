import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getSubmissionsByAssignment, getNotMarkedSubmissions, getMarkedSubmissions } from '../controllers/submissionController.js';  // Import the controller function

const submissionRoute = express.Router();

// All routes should check for a valid token
submissionRoute.use(verifyToken);

// Route to get the submissions for a specific student ?
submissionRoute.get('/v1/assignment/:assignmentID/submissions', getSubmissionsByAssignment);

// Route for getting submissions "To be marked"
submissionRoute.get('/v1/submissions/not-marked/:assignmentID', getNotMarkedSubmissions);

// Route for getting "Marked" submissions
submissionRoute.get('/v1/submissions/marked/:assignmentID', getMarkedSubmissions);

export default submissionRoute;