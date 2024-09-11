import express from 'express';
import { login, refreshToken } from '../controllers/authController.js';

const authRouter = express.Router();

// Login route
authRouter.post('/login', login); // Use the login function from the controller

// Refresh Token route
authRouter.post('/refresh-token', refreshToken); // Use the refreshToken function from the controller

export default authRouter;