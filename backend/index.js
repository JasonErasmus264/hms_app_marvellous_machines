// Imports from packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logPerformance } from './middleware/logger.js';
// Imports from other files
import authRoute from './routes/authRouter.js';
import adminRoute from './routes/adminRouter.js';
import userRoute from './routes/userRouter.js';
import moduleRoute from './routes/moduleRouter.js';
import assignmentRoute from './routes/assignmentRouter.js';
import submissionRoute from './routes/submissionRouter.js';
import feedbackRoute from './routes/feedbackRouter.js';
import notificationRoute from './routes/notificationRouter.js';
import userModuleRoute from './routes/userModuleRouter.js';

// Load Environment Variables
dotenv.config();

// Initialize
const PORT = process.env.PORT || 3000;
const app = express();

// Log Performance
app.use(logPerformance);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoute);
app.use(adminRoute);
app.use(userRoute);
app.use(moduleRoute);
app.use(assignmentRoute);
app.use(submissionRoute);
app.use(feedbackRoute);
app.use(notificationRoute);
app.use(userModuleRoute);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at port ${PORT}`);
});