import pool from '../db.js';  // Database connection

// Get student marks based on moduleID and student userID
export const getStudentMarksByUserAndModule = async (req, res) => {
  const { moduleID, userID } = req.params;  // Extract moduleID (for the module) and userID (for the student)

  try {
    // Query to get assignment name, student mark, comment, and total marks
    const [rows] = await pool.query(
      `SELECT 
         a.assignName,          -- Assignment name
         f.mark,                -- Mark given in feedback
         f.comment,             -- Comment from feedback
         a.assignTotalMarks     -- Maximum possible marks for the assignment
       FROM 
         submission s
       INNER JOIN 
         feedback f ON s.submissionID = f.submissionID
       INNER JOIN 
         assignment a ON s.assignmentID = a.assignmentID
       WHERE 
         a.moduleID = ?         -- Match moduleID from assignment (module of interest)
         AND s.userID = ?`,      // Match userID from submission (student of interest)
      [moduleID, userID]         // Use moduleID (module) and userID (student) parameters in the query
    );

    // If no data is found
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No marks found for the specified moduleID and userID' });
    }

    // Map over the results and format the output
    const feedback = rows.map(row => {
      const percentage = ((row.mark / row.assignTotalMarks) * 100).toFixed(2);  // Calculate percentage
      return {
        assignName: row.assignName,
        markFormatted: `${row.mark}/${row.assignTotalMarks} (${percentage}%)`,  // Format mark/total and percentage
        comment: row.comment
      };
    });

    // Return the formatted data under the "feedback" key
    res.status(200).json({ feedback });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching marks', error });
  }
};