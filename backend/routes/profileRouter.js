import express from 'express';
import { uploadProfilePicture } from '../controllers/profileController.js';
import verifyToken from '../middleware/verifyToken.js';

const profileRouter = express.Router();

profileRouter.use(verifyToken);

profileRouter.post('/v1/upload-profile-picture', uploadProfilePicture);

export default profileRouter;