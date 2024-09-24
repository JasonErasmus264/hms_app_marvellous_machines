import express from 'express';
import  { uploadVideo, getPublicUrl }  from '../controllers/videoController.js';
import verifyToken from '../middleware/verifyToken.js';

const videoRouter = express.Router();

videoRouter.use(verifyToken);

videoRouter.post('/v1/upload-video', uploadVideo);

videoRouter.get('/v1/get-url/:id', getPublicUrl);

export default videoRouter;
