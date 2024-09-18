// IMPORTS FROM PACKAGES
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import dotenv from 'dotenv'; // Import dotenv for environment variables


// IMPORTS FROM OTHER FILES
import authRoute from './routes/authRouter.js';
import userRoute from './routes/userRouter.js';
import assignmentRoute from './routes/assignmentRouter.js';
import videoRouter from './routes/videoRouter.js'; 
import submissionRoute from './routes/submissionRouter.js';
import feedbackRoute from './routes/feedbackRouter.js';

// Load environment variables
dotenv.config();

// INIT
const PORT = process.env.PORT || 3000;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', assignmentRoute);
app.use('/api', submissionRoute);
app.use('/api', feedbackRoute);
app.use('/api/v1', videoRouter); 


import { getStudentMarksByUserAndModule, downloadMarks } from './controllers/feedbackController.js';

app.get('/v1/download-marks', downloadMarks);




app.get("/", (req, res) => {
  res.send("Welcome to the Marvellous Machines API!");
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at port ${PORT}`);
});