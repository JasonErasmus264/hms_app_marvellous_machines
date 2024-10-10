import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { getUser, updateUser, changePassword, uploadProfilePicture } from '../controllers/userController.js';
import corsOptions from '../middleware/cors.js';
import cors from 'cors';

const userRoute = express.Router();

// All routes should check for a valid token
userRoute.use(verifyToken);

// Get current user info (available to all users)
userRoute.get('/v1/users', getUser);

// Update user info (available to all users)
userRoute.put('/v1/users', updateUser);

// Add route for changing password (available to all users)
userRoute.put('/v1/users/change-password', changePassword);

// Apply CORS middleware to Nextcloud picture upload route
userRoute.post('/v1/upload-profile-picture', cors(corsOptions), uploadProfilePicture);

export default userRoute;