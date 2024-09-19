import express from 'express';
import { uploadVideo } from '../controllers/videoController.js';

const videoRouter = express.Router();

videoRouter.post('/upload-video', uploadVideo);

export default videoRouter;
