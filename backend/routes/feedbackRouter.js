import express from 'express';
import pool from '../db.js';

const feedbackRouter = express.Router();
//Fetch from feedback table
feedbackRouter.get('/api/v1/feedback', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT userID, submissionID, mark, comment FROM feedback');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default feedbackRouter;