import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import { authorize } from '../middleware/authorizeUser.js'; // Middleware to ensure admin access
import { getAllUsers, createUser, updateUserByAdmin, deleteUser } from '../controllers/adminController.js';

const adminRoute = express.Router();

// All routes require token verification and admin authorization
adminRoute.use(verifyToken);
adminRoute.use(authorize(['Admin'])); // Only Admins can access these routes


// Route to get all users or create a new user (/v1/admin/users)
adminRoute.route('/v1/admin/users')
  .get(getAllUsers)  // GET all users (Admin only)
  .post(createUser);  // POST create a new user (Admin only)

// Route to update or delete a specific user (/v1/admin/users/:userID)
adminRoute.route('/v1/admin/users/:userID')
  .put(updateUserByAdmin)  // PUT update any user (Admin only)
  .delete(deleteUser);     // DELETE a user (Admin only)

export default adminRoute;

