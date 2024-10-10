import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import { addUserToModule, deleteUserFromModule, getEnrolledUsers, getNotEnrolledUsers } from '../controllers/userModuleController.js';

const userModuleRoute = express.Router();

// All routes require token verification
userModuleRoute.use(verifyToken);

// Add a user to a module (Admins only)
userModuleRoute.post('/v1/user-module', authorizeRoles('Admin'), addUserToModule);

// Delete a user from a module (Admins only)
userModuleRoute.delete('/v1/user-module/:moduleID/:userID', authorizeRoles('Admin'), deleteUserFromModule);

// Get enrolled users for a specific module (Admins only)
userModuleRoute.get('/v1/user-module/enrolled/:moduleID', authorizeRoles('Admin'), getEnrolledUsers);

// Get users not enrolled in a specific module (Admins only)
userModuleRoute.get('/v1/user-module/not-enrolled/:moduleID', authorizeRoles('Admin'), getNotEnrolledUsers);

export default userModuleRoute;