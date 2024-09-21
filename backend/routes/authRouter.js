import express from 'express'; 
import { loginLimiter, login, refreshToken, logout, requestPasswordReset, verifyResetCode, resetPassword } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const authRouter = express.Router();

// Apply loginLimiter to the login route
authRouter.post('/v1/login', loginLimiter, login);

// Refresh Token route
authRouter.post('/v1/refresh-token', refreshToken);

// Logout route, protected by verifyToken
authRouter.post('/v1/logout', verifyToken, logout);

// Route to request password reset (send email with 6-digit code)
authRouter.post('/v1/forgot-password', requestPasswordReset);

// Route to verify reset code
authRouter.post('/v1/verify-reset-code', verifyResetCode);

// Route to reset password after code verification
authRouter.post('/v1/reset-password', resetPassword);

export default authRouter;