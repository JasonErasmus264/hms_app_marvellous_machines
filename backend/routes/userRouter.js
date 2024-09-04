import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getUserInfo, createUser } from '../controllers/userController.js';

const userRoute = express.Router();

// All routes should check for a valid token
userRoute.use(verifyToken);

// GET USER route
userRoute.get('/user', getUserInfo); // Use the getUserInfo function from the controller

// CREATE USER route
userRoute.post('/addUser', createUser); // Use the createUser function from the controller

export default userRoute;