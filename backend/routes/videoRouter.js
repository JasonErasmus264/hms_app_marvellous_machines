import express from 'express';
import  { uploadVideo }  from '../controllers/videoController.js';
import verifyToken from '../middleware/verifyToken.js';

const videoRouter = express.Router();

videoRouter.use(verifyToken);

videoRouter.post('/v1/upload-video', uploadVideo);

export default videoRouter;
