import express from 'express'; 
import { loginLimiter, login, refreshToken, logout } from '../controllers/authController.js';

const authRouter = express.Router();

// Apply loginLimiter to the login route
authRouter.post('/v1/login', loginLimiter, login);

// Refresh Token route
authRouter.post('/v1/refresh-token', refreshToken);

// Logout route
authRouter.post('/v1/logout', logout);

export default authRouter;