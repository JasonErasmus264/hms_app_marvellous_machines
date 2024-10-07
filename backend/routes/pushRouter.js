import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Middleware to check JWT
import pushController from '../controllers/pushController.js';

const pushRoute = express.Router();

// Handle subscription
app.post('/v1/subscribe', pushController.subscribe);

export default pushRoute;