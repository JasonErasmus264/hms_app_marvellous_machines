import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const feedbackRoute = express.Router();

feedbackRoute.use(verifyToken);

feedbackRoute.get('/download/xlsx', downloadMarksXLSX);
feedbackRoute.get('/download/csv', downloadMarksCSV);

export default feedbackRoute;