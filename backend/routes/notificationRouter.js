import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {getNotification, submissionNotification, deleteNotification } from '../controllers/notificationController.js';

const notificationRoute = express.Router();

// All routes should check for a valid token
notificationRoute.use(verifyToken);

// Route to get all notifications for the current user
notificationRoute.get('/v1/notifications', getNotification);

// Route to send notification and email when a student has submitted
notificationRoute.post('/v1/notifications/:assignmentID', submissionNotification);

// Route to delete a notification
notificationRoute.delete('/v1/notifications/:notificationID', deleteNotification);

export default notificationRoute;