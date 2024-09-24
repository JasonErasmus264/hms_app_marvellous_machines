import pool from '../db.js';  // Database connection
import XLSX from 'xlsx';
import { feedbackLogger } from '../middleware/logger.js'; // Import feedback logger



// Add feedback
export const addFeedback = async (req, res) => {
  const { submissionID, userID, comment, mark } = req.body;

  // Ensure all required fields are provided
  if (!submissionID || !comment || mark === undefined) {
    // Log a warning if missing required fields (warning log)
    feedbackLogger.warn('Missing required fields');
    return res.status(400).json({ message: 'Submission ID, comment, and mark are required' });
  }

  try {
    const result = await pool.execute(
      'INSERT INTO feedback (submissionID, userID, comment, mark) VALUES (?, ?, ?, ?)',
      [submissionID, userID || null, comment, mark]
    );

    // Log success if feedback is added (information log)
    feedbackLogger.info(`Feedback added: ${result[0].insertId} for submission ${submissionID}`);
    res.status(201).json({ message: 'Feedback added successfully', feedbackID: result[0].insertId });
  } catch (error) {
    // Log error if adding feedback fails (error log)
    feedbackLogger.error(`Error adding feedback for submission:${submissionID}, ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  const { feedbackID } = req.params;
  const { comment, mark } = req.body;

  // Ensure both fields are provided
  if (!comment || mark === undefined) {
    // Log a warning if missing required fields (warning log)
    feedbackLogger.warn(`Update Feedback: Missing required fields for feedbackID: ${feedbackID}`);
    return res.status(400).json({ message: 'Comment and mark are required' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE feedback SET comment = ?, mark = ? WHERE feedbackID = ?',
      [comment, mark, feedbackID]
    );

    if (result.affectedRows === 0) {
      // Log no feedback found (information log)
      feedbackLogger.info(`No feedback found for feedbackID: ${feedbackID}`);
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log success for updated feedback (information log)
    feedbackLogger.info(`Feedback updated successfully for feedbackID: ${feedbackID}`);
    res.status(200).json({ message: 'Feedback updated successfully' });
  } catch (error) {
    // Log error if updating feedback fails (error log)
    feedbackLogger.error(`Error updating feedback: ${feedbackID}, ${error.message}`, { error });
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
      // Log a warning if feedback not found (warning log)
      feedbackLogger.warn(`Delete Feedback: Feedback not found for feedbackID: ${feedbackID}`);
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Log success if feedback deleted (information log)
    feedbackLogger.info(`Feedback deleted successfully for feedbackID: ${feedbackID}`);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    // Log error if deleting feedback fails (error log)
    feedbackLogger.error(`Error deleting feedback: ${feedbackID}, ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};






























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
      // Log a warning if no marks found (warning log)
      feedbackLogger.warn(`No marks found for moduleID: ${moduleID} and userID: ${userID}`);
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

    // Log success for fetched marks (information log)
    feedbackLogger.info(`Successfully fetched marks for user: ${userID} in module: ${moduleID}`, { feedback });
    // Return the formatted data under the "feedback" key
    res.status(200).json({ feedback });

  } catch (error) {
    // Log error if fetching marks fails (error log)
    feedbackLogger.error(`Error fetching marks for user: ${userID} in module ${moduleID}, ${error.message}`, { error });
    res.status(500).json({ message: 'Error fetching marks', error });
  }
};


/*export const downloadMarks = async (req, res) => {
  const { assignmentID, format } = req.params;
  const [rows] = await pool.query(
      `SELECT 
         s.userID,
         u.userName,
         f.mark,
         f.comment,
         a.assignTotalMarks
       FROM 
         submission s
       INNER JOIN 
         feedback f ON s.submissionID = f.submissionID
       INNER JOIN 
         assignment a ON s.assignmentID = a.assignmentID
       INNER JOIN 
         user u ON s.userID = u.userID
       WHERE 
         a.assignmentID =?`,
      [assignmentID]
    );



};*/


export const downloadMarks = async (req, res) => { 
  try {
    // SQL query to fetch the required data
    const [rows] = await pool.query(
      `SELECT 
          u.firstName AS StudentFirstName,
          u.lastName AS StudentLastName,
          u.username AS StudentUsername,
          f.comment AS FeedbackComment,
          f.mark AS Mark,
          a.assignTotalMarks AS TotalMarks
      FROM 
          submission s
      JOIN 
          feedback f ON s.submissionID = f.submissionID
      JOIN 
          users u ON s.userID = u.userID
      JOIN 
          assignment a ON s.assignmentID = a.assignmentID
      WHERE 
          u.userType = 'Student';`
    );

    // Check if rows are returned
    if (rows.length === 0) {
      // Log a warning if no data found (warning log)
      feedbackLogger.warn(`No data found`);
      return res.status(404).send('No data found.');
    }

    // Define the sheet header
    const heading = [['First Name', 'Last Name', 'Username', 'Comment', 'Mark', 'Total Marks']];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');

    // Write the workbook to a buffer
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers to prompt download
    res.setHeader('Content-Disposition', 'attachment; filename=student_marks.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    // Log success for downloading marks (information log)
    feedbackLogger.info(`Successfully downloaded marks for user: ${userID}`)
    // Send the buffer as the response
    return res.send(buffer);
    
  } catch (error) {
    // Log error if downloading marks fails
    feedbackLogger.error(`Error downloading marks: ${error.message}`, { error })
    res.status(500).send('Internal Server Error');
  }
};







import  parse  from 'json2csv';  
//import { feedbackLogger } from '../logger.js'; // import feedback logger

// Function to download marks as XLSX
export const downloadMarksXLSX = async (req, res) => { 
  const { userID } = req.user; 
  try {
    const [rows] = await pool.query(
      `SELECT 
          m.moduleName AS ModuleName,
          a.assignName AS AssignmentName,
          f.comment AS FeedbackComment,
          f.mark AS Mark,
          a.assignTotalMarks AS TotalMarks
      FROM 
          submission s
      JOIN 
          feedback f ON s.submissionID = f.submissionID
      JOIN 
          assignment a ON s.assignmentID = a.assignmentID
      JOIN
          module m ON a.moduleID = m.moduleID
      WHERE 
          s.userID = ?;`, [userID] 
    );

    const heading = [['Module', 'Assignment', 'Comment', 'Mark', 'Total Marks']];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(worksheet, heading);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // log successful data retrieval and CSV generation (information log)
    feedbackLogger.info(`Successfully generated Excel file for user: ${userID}`);
    res.attachment('student_marks.xlsx');
    res.send(buffer);
  } catch (error) {
    // Log error when no data is found (error log)
    feedbackLogger.error(`Error downloading XLSX for user: ${userID}: ${error.message}`, { error });
    res.status(500).send('Error downloading Excel file'); 
  } 
};

// Function to download marks as CSV
export const downloadMarksCSV = async (req, res) => {
  const { userID } = req.user; 
  try {
    const [rows] = await pool.query(
      `SELECT 
          m.moduleName AS ModuleName,
          a.assignName AS AssignmentName,
          f.comment AS FeedbackComment,
          f.mark AS Mark,
          a.assignTotalMarks AS TotalMarks
      FROM 
          submission s
      JOIN 
          feedback f ON s.submissionID = f.submissionID
      JOIN 
          assignment a ON s.assignmentID = a.assignmentID
      JOIN
          module m ON a.moduleID = m.moduleID
      WHERE 
          s.userID = ?;`, [userID]  
    );
   
    // log successful data retrieval and CSV generation (information log)
    feedbackLogger.info(`Successfully generated CSV for user: ${userID}`);
    const csv = parse(rows);
    res.attachment('student_marks.csv');
    res.send(csv);
  } catch (error) {
    // Log error when no data is found (error log)
    feedbackLogger.error(`Error downloading CSV for user: ${userID}: ${error.message}`, { error });
    res.status(500).send('Error downloading CSV file'); 
  }
};
