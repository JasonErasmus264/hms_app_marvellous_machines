import express from 'express';
import  { uploadVideo, updateVideo }  from '../controllers/videoController.js';
import verifyToken from '../middleware/verifyToken.js';

const videoRouter = express.Router();

videoRouter.use(verifyToken);

videoRouter.post('/v1/upload-video', uploadVideo);

videoRouter.put('/v1/update-video', updateVideo);

export default videoRouter;
