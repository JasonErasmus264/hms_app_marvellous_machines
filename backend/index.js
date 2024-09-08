// IMPORTS FROM PACKAGES
import express from 'express';
import cors from 'cors';

// IMPORTS FROM OTHER FILES
import authRoute from './routes/authRouter.js';
import userRoute from './routes/userRouter.js';
import assignmentRoute from './routes/assignmentRouter.js';


// INIT
const PORT = process.env.PORT || 3000;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1', authRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', assignmentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Marvellous Machines API!");
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at port ${PORT}`);
});