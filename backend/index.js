// IMPORTS FROM PACKAGES
import express from 'express';
import cors from 'cors';

// IMPORTS FROM OTHER FILES
import authRoute from './routes/authRouter.js';


// INIT
const PORT = process.env.PORT || 3000;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(authRoute);

// Connections
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at port ${PORT}`);
});
