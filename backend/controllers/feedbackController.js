import pool from '../db.js';
import XLSX from 'xlsx';
import { parse } from 'json2csv';  
import { feedbackLogger } from '../logger.js'; // import feedback logger

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
    // Log when no data is found (error log)
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
    // Log when no data is found (error log)
    feedbackLogger.error(`Error downloading CSV for user: ${userID}: ${error.message}`, { error });
    res.status(500).send('Error downloading CSV file'); 
  }
};