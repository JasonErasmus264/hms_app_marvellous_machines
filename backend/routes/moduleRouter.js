import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
//import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import { getModules} from '../controllers/moduleController.js';

const moduleRoute = express.Router();

// All routes require token verification and Admin and Lecturer authorization
moduleRoute.use(verifyToken);

// Get modules for dropdown 
moduleRoute.get('/v1/module', getModules); // Use the getModules function from the controller





export default moduleRoute;