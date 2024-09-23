import pool from '../db.js';

// Function to get modules for dropdown
export const getModules = async (req, res) => {
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
    res.status(500).json({ message: 'An error occurred while fetching modules' });
  }
};




















export const deleteModule = async (req, res) => {
    const { moduleID } = req.params;
  
    try {
      // Execute the delete query for the module
      const [result] = await pool.execute('DELETE FROM module WHERE moduleID = ?', [moduleID]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Module not found' });
      }
  
      res.status(200).json({ message: 'Module deleted successfully, along with related assignments, submissions, and feedback.' });
    } catch (error) {
      console.error('Error deleting module:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };