import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const feedbackRoute = express.Router();

feedbackRoute.use(verifyToken);

feedbackRoute.get('/feedback', getFeedback);

export default feedbackRoute;
