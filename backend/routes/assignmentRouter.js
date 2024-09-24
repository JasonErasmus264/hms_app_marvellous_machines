import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { authorizeRoles } from '../middleware/authorization.js'; // Import the authorization middleware
import { addAssignment, getAssignmentsByModule, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';

const assignmentRoute = express.Router();

// All routes require token verification and Admin and Lecturer authorization
assignmentRoute.use(verifyToken);

// Get assignments by moduleID (all authenticated users can access)
assignmentRoute.get('/v1/assignments/:moduleID', getAssignmentsByModule);

// Add an assignment to a module (Only Admin and Lecturer can access)
assignmentRoute.post('/v1/assignments/:moduleID', authorizeRoles('Admin', 'Lecturer'), addAssignment);

// Update an assignment by assignmentID (Only Admin and Lecturer can access)
assignmentRoute.put('/v1/assignments/:assignmentID', authorizeRoles('Admin', 'Lecturer'), updateAssignment);

// Delete an assignment by assignmentID (Only Admin and Lecturer can access)
assignmentRoute.delete('/v1/assignments/:assignmentID', authorizeRoles('Admin', 'Lecturer'), deleteAssignment);

export default assignmentRoute;