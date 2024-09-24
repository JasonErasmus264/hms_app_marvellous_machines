import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import { getAllUsers, getUserInfo, createUser, updateUser, deleteUser } from '../controllers/adminController.js';

const adminRoute = express.Router();

// All routes require token verification and admin authorization
adminRoute.use(verifyToken);

// GET all users (Admin only)
adminRoute.get('/v1/admin', authorizeRoles('Admin'), getAllUsers);

// POST create a new user (Admin only)
adminRoute.post('/v1/admin', authorizeRoles('Admin'), createUser);

// GET a selected users info (Admin only)
adminRoute.get('/v1/admin/:userID', authorizeRoles('Admin'), getUserInfo);

// PATCH update any user (Admin only)
adminRoute.put('/v1/admin/:userID', authorizeRoles('Admin'), updateUser);

// DELETE a user (Admin only)
adminRoute.delete('/v1/admin/:userID', authorizeRoles('Admin'), deleteUser);

export default adminRoute;