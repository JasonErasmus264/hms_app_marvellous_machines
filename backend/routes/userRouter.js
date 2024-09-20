import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { authorize } from '../middleware/authorizeUser.js'; // Role-based middleware
import { getUserInfo, createUser } from '../controllers/userController.js';

const userRoute = express.Router();

// All routes should check for a valid token
userRoute.use(verifyToken);

// GET USER route
userRoute.get('/v1/user', getUserInfo);

// CREATE USER route (only accessible to admin users)
userRoute.post('/v1/addUser', verifyToken, authorize(['Admin']), createUser);

export default userRoute;