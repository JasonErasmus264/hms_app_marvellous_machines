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






// Add a new module
export const addModule = async (req, res) => {
  const { moduleName, moduleCode } = req.body;

  if (!moduleName || !moduleCode) {
    return res.status(400).json({ message: 'Module name and code are required' });
  }

  try {
    const result = await pool.execute(
      'INSERT INTO module (moduleName, moduleCode) VALUES (?, ?)',
      [moduleName, moduleCode]
    );

    res.status(201).json({ message: 'Module added successfully' });
  } catch (error) {
    console.error('Error adding module:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Update a module
export const updateModule = async (req, res) => {
  const { moduleID } = req.params;
  const { moduleName, moduleCode } = req.body;

  if (!moduleName || !moduleCode) {
    return res.status(400).json({ message: 'Module name and code are required' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE module SET moduleName = ?, moduleCode = ? WHERE moduleID = ?',
      [moduleName, moduleCode, moduleID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.status(200).json({ message: 'Module updated successfully' });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







// Delete a module 
export const deleteModule = async (req, res) => {
    const { moduleID } = req.params;
  
    try {
      // Execute the delete query for the module
      const [result] = await pool.execute('DELETE FROM module WHERE moduleID = ?', [moduleID]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Module not found' });
      }
  
      res.status(200).json({ message: 'Module deleted successfully, along with any related assignments, submissions, and feedback.' });
    } catch (error) {
      console.error('Error deleting module:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };