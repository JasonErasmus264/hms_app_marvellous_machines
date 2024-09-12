import express from 'express';
import pool from '../db.js';

const feedbackRouter = express.Router();
//Fetch from feedback table
feedbackRouter.get('/api/v1/feedback', async (req, res) => {
  try {
    const query = `
      SELECT 
        f.feedbackID, 
        s.userID, 
        u.userName, 
        u.userSurname, 
        s.assignmentID, 
        a.assignName, 
        f.comment, 
        f.mark 
      FROM feedback f
      JOIN submission s ON f.submissionID = s.submissionID
      JOIN assignment a ON s.assignmentID = a.assignmentID
      JOIN user u ON s.userID = u.userID
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default feedbackRouter;