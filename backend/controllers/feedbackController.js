import pool from '../db.js';
import XLSX from 'xlsx';
import { parse } from 'json2csv';  // Import parse function for CSV

// Function to download marks as XLSX
export const downloadMarksXLSX = async (req, res) => { 
  try {
    const [rows] = await pool.query(`
      SELECT 
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
          u.userType = 'Student';
    `);

    const heading = [['First Name', 'Last Name', 'Username', 'Comment', 'Mark', 'Total Marks']];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(worksheet, heading);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');
    const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});

    res.attachment('student_marks.xlsx');
    res.send(buffer);
  } catch (error) {
    console.log(error);
  }
};

// Function to download marks as CSV
export const downloadMarksCSV = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
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
          u.userType = 'Student';
    `);
   
    const csv = parse(rows);
    res.attachment('student_marks.csv');
    res.send(csv);
  } catch (error) {
    console.log(error);
  }
};