import pool from '../db.js';


//Fetch from feedback table
export const getFeedback = async (req, res) => {
  try {
    const query = `
      SELECT 
        f.feedbackID, 
        u.username, 
        u.firstName, 
        u.lastName, 
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
};