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
assignmentRoute.get('/api/v1/assignments', async (req, res) => {
    const { moduleID } = req.query; // Get the moduleID from the query parameters
  
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
  
      res.json({ assignments: rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /*// VIEW SPECIFIC ASSIGNMENT DETAILS //
  assignmentRoute.get('/api/v1/assignments/:assignmentID', async (req, res) => {
    try {
      const { assignmentID } = req.params;
  
      const [rows] = await pool.execute('SELECT * FROM assignment WHERE assignmentID = ?', [assignmentID]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      res.json({ assignment: rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });*/










export default assignmentRoute;