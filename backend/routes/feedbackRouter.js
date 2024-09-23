import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { downloadMarksXLSX, downloadMarksCSV } from '../controllers/feedbackController.js';

const feedbackRoute = express.Router();

feedbackRoute.use(verifyToken);

feedbackRoute.get('/v1/download/xlsx', downloadMarksXLSX);
feedbackRoute.get('/v1/download/csv', downloadMarksCSV);

export default feedbackRoute;