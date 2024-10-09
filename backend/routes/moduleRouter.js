import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import { getModules, addModule, updateModule, deleteModule} from '../controllers/moduleController.js';

const moduleRoute = express.Router();

// All routes require token verification
moduleRoute.use(verifyToken);

// Get modules for dropdown 
moduleRoute.get('/v1/module', getModules);

// Add a new module (Admins only)
moduleRoute.post('/v1/module', authorizeRoles('Admin'), addModule);

// Update a module by ID (Admins only)
moduleRoute.put('/v1/module/:moduleID', authorizeRoles('Admin'), updateModule);

// Delete a module by ID (Admins only)
moduleRoute.delete('/v1/module/:moduleID', authorizeRoles('Admin'), deleteModule);

export default moduleRoute;