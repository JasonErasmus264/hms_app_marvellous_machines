import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import authorizeRoles  from '../middleware/authorization.js';
import { addUserToModule, deleteUserFromModule } from '../controllers/userModuleController.js';

const userModuleRoute = express.Router();

// All routes require token verification and Admin role authorization
userModuleRoute.use(verifyToken);

// Add a user to a module (Admins only)
userModuleRoute.post('/v1/user-module', authorizeRoles('Admin'), addUserToModule);

// Delete a user from a module (Admins only)
userModuleRoute.delete('/v1/user-module', authorizeRoles('Admin'), deleteUserFromModule);

export default userModuleRoute;