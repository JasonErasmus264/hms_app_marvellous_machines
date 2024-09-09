import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getStudentMarksByUserAndModule } from '../controllers/feedbackController.js';

const feedbackRoute = express.Router();

// All routes should check for a valid token
feedbackRoute.use(verifyToken);

// GET STUDENT MARKS BASED ON MODULE ID AND USER ID
feedbackRoute.get('/feedback/:moduleID/:userID', getStudentMarksByUserAndModule);

export default feedbackRoute;