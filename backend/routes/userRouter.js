import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { getUser, updateUser } from '../controllers/userController.js';

const userRoute = express.Router();

// All routes should check for a valid token
userRoute.use(verifyToken);

// Get current user info (available to all users)
userRoute.get('/v1/users', getUser);

userRoute.patch('/v1/users', updateUser);


export default userRoute;