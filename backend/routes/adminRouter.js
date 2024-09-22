import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { authorize } from '../middleware/authorizeUser.js'; // Middleware to ensure admin access
import { getAllUsers, getUserInfo, createUser, updateUser, deleteUser } from '../controllers/adminController.js';

const adminRoute = express.Router();

// All routes require token verification and admin authorization
adminRoute.use(verifyToken);
adminRoute.use(authorize(['Admin'])); // Only Admins can access these routes

// GET all users (Admin only)
adminRoute.get('/v1/admin', getAllUsers);

// POST create a new user (Admin only)
adminRoute.post('/v1/admin', createUser);

// GET a selected users info (Admin only)
adminRoute.get('/v1/admin/:userID', getUserInfo);

// PATCH update any user (Admin only)
adminRoute.patch('/v1/admin/:userID', updateUser);

// DELETE a user (Admin only)
adminRoute.delete('/v1/admin/:userID', deleteUser);

export default adminRoute;