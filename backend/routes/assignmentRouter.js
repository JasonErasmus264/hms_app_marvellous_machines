import express from 'express';
import pool from '../db.js';
import verifyToken from '../middleware/verifyToken.js';

const assignmentRoute = express.Router();

// All routes should check for a valid token
assignmentRoute.use('/api/v1', verifyToken);








// GET MODULES FOR DROPDOWN //
assignmentRoute.get('/api/v1/module', async (req, res) => {
    try {
      const { userID, userType } = req.user;
  
      let query = '';
      let params = [];
  
      // Admins can see all modules
      if (userType === 'Admin') {
        query = 'SELECT moduleID, moduleCode FROM module';
      } else {
        // Lecturers and Students see only the modules they are enrolled in
        query = `
          SELECT m.moduleID, m.moduleCode
          FROM module m
          INNER JOIN user_module um ON m.moduleID = um.moduleID
          WHERE um.userID = ?`;
        params = [userID];
      }
  
      const [rows] = await pool.execute(query, params);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No modules found' });
      }
  
      res.json({ modules: rows });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching modules' });
    }
});






// GET ASSIGNMENTS BASED ON MODULE ID //
assignmentRoute.get('/api/v1/assignments/:moduleID', async (req, res) => {
  const { moduleID } = req.params; // Get the moduleID from the URL path
  
  try {
    // Validate the moduleID
    if (!moduleID) {
      return res.status(400).json({ message: 'Module ID is required' });
    }

    // Fetch assignments based on the provided moduleID
    const [rows] = await pool.execute('SELECT * FROM assignment WHERE moduleID = ?', [moduleID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this module' });
    }

    // Format the assignOpenDate and assignDueDate for each assignment
    const formattedAssignments = rows.map(assignment => {
      // Parse the dates from the input string
      const assignOpenDate = new Date(assignment.assignOpenDate);
      const assignDueDate = new Date(assignment.assignDueDate);
    
      // Function to format dates to '01 September 2024 at 12:00'
      const formatDate = (date) => {
        const options = {
          day: '2-digit',
          month: 'long', // Full month name
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
    
        // Format the date
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
        return formattedDate.replace(',', ' at'); // Replace the comma with ' at'
      };
    
      // Return the assignment with formatted open and due dates
      return {
        ...assignment,
        assignOpenDate: formatDate(assignOpenDate),
        assignDueDate: formatDate(assignDueDate),
      };
    });

    res.json({ assignments: formattedAssignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








export default assignmentRoute;