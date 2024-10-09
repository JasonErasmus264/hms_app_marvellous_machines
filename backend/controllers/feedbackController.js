import pool from '../db.js';  // Database connection
import XLSX from 'xlsx';
import  {parse}  from 'json2csv';  
import { feedbackLogger } from '../middleware/logger.js';



// Get feedback for a specific submission, including the assignment's total marks
export const getFeedback = async (req, res) => {
  const { submissionID } = req.params; // Get submissionID from URL parameters

  // Ensure submissionID is provided
  if (!submissionID) {
    // Log a warning if submissionID is missing
    feedbackLogger.warn('Missing submissionID for fetching feedback');
    return res.status(400).json({ message: 'Submission ID is required' });
  }

  try {
    // Fetch feedback and assignment total marks based on the submissionID
    const [feedback] = await pool.execute(
      `SELECT f.feedbackID, f.comment, f.mark, a.assignTotalMarks 
       FROM feedback f 
       JOIN submission s ON f.submissionID = s.submissionID
       JOIN assignment a ON s.assignmentID = a.assignmentID
       WHERE f.submissionID = ?`,
      [submissionID]
    );

    // Check if feedback exists
    if (feedback.length === 0) {
      // Log information if no feedback is found
      feedbackLogger.info(`No feedback found for submissionID: ${submissionID}`);
      return res.status(200).json({ feedbackExists: 'f', message: 'No feedback found' });
    }

    // Log success for retrieving feedback
    feedbackLogger.info(`Feedback retrieved successfully for submissionID: ${submissionID}`);

    // Respond with the feedback (comment, mark, total marks) and flag that feedback exists
    res.json({
      feedbackExists: 't', // 't' indicates that feedback exists
      feedbackID: feedback[0].feedbackID,
      comment: feedback[0].comment,
      mark: feedback[0].mark,
      totalMarks: feedback[0].assignTotalMarks // Include the total marks for the assignment
    });
  } catch (error) {
    // Log error if fetching feedback fails
    feedbackLogger.error(`Error fetching feedback for submissionID ${submissionID}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Add feedback
export const addFeedback = async (req, res) => {
  const { submissionID, comment, mark } = req.body;
  const { userID } = req.user;

  // Ensure all required fields are provided
  if (!submissionID || !comment || mark === undefined) {
    // Log warning for missing required fields (warning log)
    feedbackLogger.warn('Missing required fields for adding feedback');
    return res.status(400).json({ message: 'Submission ID, comment, and mark are required' });
  }

  try {
    const result = await pool.execute(
      'INSERT INTO feedback (submissionID, userID, comment, mark) VALUES (?, ?, ?, ?)',
      [submissionID, userID || null, comment, mark]
    );
    // Log success for adding feedback (information log)
    feedbackLogger.info('Feedback added successfully', { feedbackID: result[0].insertId });
    res.status(201).json({ message: 'Feedback added successfully', feedbackID: result[0].insertId });
  } catch (error) {
    // Log error if adding feedback fails (error log)
    feedbackLogger.error(`Error adding feedback: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  const { feedbackID } = req.params;
  const { comment, mark } = req.body;

  // Ensure both fields are provided
  if (!comment || mark === undefined) {
    // Log warning if missing required fields (warning log)
    feedbackLogger.warn('Missing fields required for updating feedback');
    return res.status(400).json({ message: 'Comment and mark are required' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE feedback SET comment = ?, mark = ? WHERE feedbackID = ?',
      [comment, mark, feedbackID]
    );

    if (result.affectedRows === 0) {
      // Log warning for feedback not found (warning log)
      feedbackLogger.warn('Feedback not found for update', { feedbackID });
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log success for updated feedback (information log)
    feedbackLogger.info('Feedback updated successfully', { feedbackID });
    res.status(200).json({ message: 'Feedback updated successfully' });
  } catch (error) {
    // Log error when updating feedback fails (error log)
    feedbackLogger.error(`Error updating feedback: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  const { feedbackID } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM feedback WHERE feedbackID = ?',
      [feedbackID]
    );

    if (result.affectedRows === 0) {
      // Log warning for feedback not found (warning log)
      feedbackLogger.warn('Feedback not found for deletion:', { feedbackID });
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log success when feedback is deleted (information log)
    feedbackLogger.info('Feedback deleted successfully', { feedbackID });
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    feedbackLogger.error(`Error deleting feedback: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};









// Get student marks based on moduleID and student userID
export const getStudentMarksByUserAndModule = async (req, res) => {
  const { moduleID} = req.params;  // Extract moduleID (for the module) and userID (for the student)
  const { userID } = req.user;  // Extract userID (for the student)

  try {
    // Query to get assignment name, student mark, comment, and total marks
    const [rows] = await pool.query(
      `SELECT 
         a.assignName,
         f.mark,
         f.comment,
         a.assignTotalMarks
       FROM 
         submission s
       INNER JOIN 
         feedback f ON s.submissionID = f.submissionID
       INNER JOIN 
         assignment a ON s.assignmentID = a.assignmentID
       WHERE 
         a.moduleID = ?
         AND s.userID = ?`,
      [moduleID, userID]
    );

    // If no data is found
    if (rows.length === 0) {
      // Log warning if no marks found for module and user (warning log)
      feedbackLogger.warn('No marks found for the specified moduleID and userID', { moduleID, userID });
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

    //Log success if marks retrieved (information log)
    feedbackLogger.info('Student marks retrieved successfully', { moduleID, userID });
    // Return the formatted data under the "feedback" key
    res.status(200).json({ feedback });

  } catch (error) {
    // Log error when fetching marks fails (error log)
    feedbackLogger.error(`Error fetching marks: ${error.message}`, { error });
    res.status(500).json({ message: 'Error fetching marks', error });
  }
};







export const downloadMarks = async (req, res) => {
  const { assignmentID, format } = req.params; // Get assignmentID and format (xlsx or csv)

  try {
    // SQL query to fetch student data for the specific assignment
    const [rows] = await pool.query(
      `SELECT 
          u.firstName AS StudentFirstName,
          u.lastName AS StudentLastName,
          u.username AS StudentUsername,
          f.comment AS FeedbackComment,
          f.mark AS Mark,
          a.assignTotalMarks AS TotalMarks,
          ROUND((f.mark / a.assignTotalMarks) * 100, 2) AS PercentageMark
      FROM 
          submission s
      JOIN 
          feedback f ON s.submissionID = f.submissionID
      JOIN 
          users u ON s.userID = u.userID
      JOIN 
          assignment a ON s.assignmentID = a.assignmentID
      WHERE 
          a.assignmentID = ?;`,
      [assignmentID]
    );

    // Check if no data is returned
    if (rows.length === 0) {
      // Log warning if no data found (warning log)
      feedbackLogger.warn(`No data found for the given assignment: ${assignmentID}`);
      return res.status(404).json({ message: 'No data found for the given assignment.' });

    }

    // Handle XLSX format
    if (format === 'xlsx') {
      const heading = [['First Name', 'Last Name', 'Username', 'Comment', 'Mark', 'Total Marks', 'Percentage']];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');

      // Write the workbook to a buffer
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      // Set response headers to download the XLSX file
      res.setHeader('Content-Disposition', 'attachment; filename=student_marks.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      // Log success if file generated (information log)
      feedbackLogger.info(`XLSX file generated successfully for assignment: ${assignmentID}`);
      return res.send(buffer);
    }

    // Handle CSV format
    else if (format === 'csv') {
      // Define the CSV fields
      const csvFields = ['StudentFirstName', 'StudentLastName', 'StudentUsername', 'FeedbackComment', 'Mark', 'TotalMarks', 'PercentageMark'];
      const csv = parse(rows, { fields: csvFields });

      // Set response headers to download the CSV file
      res.setHeader('Content-Disposition', 'attachment; filename=student_marks.csv');
      res.setHeader('Content-Type', 'text/csv');

      // Log success if file generated (information log)
      feedbackLogger.info(`CSV file generated successfully for assignment: ${assignmentID}`);
      return res.send(csv);
    } 

    // If the format is not supported
    else {
      // Log warning for invalid format (warning log)
      feedbackLogger.warn(`Invalid format specified for download: ${format}`);
      return res.status(400).json({ message: 'Invalid format specified. Use either "xlsx" or "csv".' });

    }

  } catch (error) {
    // Log error when exporting marks fails (error log)
    feedbackLogger.error(`Error exporting marks ${error.message}`, { error });
    res.status(500).json({ message: 'Internal Server Error'});
  }
};