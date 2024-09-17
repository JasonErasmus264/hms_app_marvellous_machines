import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getModules, getAssignmentsByModule } from '../controllers/assignmentController.js';

const assignmentRoute = express.Router();

// All routes should check for a valid token
assignmentRoute.use(verifyToken);

// GET MODULES FOR DROPDOWN route
assignmentRoute.get('/v1/module', getModules); // Use the getModules function from the controller

// GET ASSIGNMENTS BASED ON MODULE ID route
assignmentRoute.get('/v1/assignments/:moduleID', getAssignmentsByModule); // Use the getAssignmentsByModule function from the controller

export default assignmentRoute;