import pool from '../db.js';
import { moduleLogger } from '../middleware/logger.js'; // Import module logger

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

      // Log user module request (information log)
      moduleLogger.info(`User ${userID} requested modules they are enrolled in.`);
    }

    const [rows] = await pool.execute(query, params);

    if (rows.length === 0) {
      // Log a warning if no modules found (warning log)
      moduleLogger.warn(`No modules found for user ${userID}.`);
      return res.status(404).json({ message: 'No modules found' });
    }

    // Log success for module retrieval (information log)
    moduleLogger.info(`Modules successfully retrieved for user ${userID}.`);
    res.json({ modules: rows });
  } catch (error) {
    // Log error when fetching modules fails (error log)
    moduleLogger.error(`Error fetching modules for user ${req.user.userID}: ${error.message}`);
    res.status(500).json({ message: 'An error occurred while fetching modules' });
  }
};






// Add a new module
export const addModule = async (req, res) => {
  const { moduleName, moduleCode } = req.body;

  if (!moduleName || !moduleCode) {
    // Log a warning if missing fields (warning log)
    moduleLogger.warn('Module name and code are required for adding a new module.');
    return res.status(400).json({ message: 'Module name and code are required' });
  }

  try {
    const result = await pool.execute(
      'INSERT INTO module (moduleName, moduleCode) VALUES (?, ?)',
      [moduleName, moduleCode]
    );

    // Log success if module added (information log)
    moduleLogger.info(`Module added: ${moduleName} (${moduleCode}).`);
    res.status(201).json({ message: 'Module added successfully' });
  } catch (error) {
    // Log error when adding module fails (error log)
    moduleLogger.error(`Error adding module ${moduleName}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Update a module
export const updateModule = async (req, res) => {
  const { moduleID } = req.params;
  const { moduleName, moduleCode } = req.body;

  if (!moduleName || !moduleCode) {
    // Log a warning if unmatching name and code (warning log)
    moduleLogger.warn('Module name and code are required for updating the module.');
    return res.status(400).json({ message: 'Module name and code are required' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE module SET moduleName = ?, moduleCode = ? WHERE moduleID = ?',
      [moduleName, moduleCode, moduleID]
    );

    if (result.affectedRows === 0) {
      // Log a warning if module not found (warning log)
      moduleLogger.warn(`Module not found for update: ${moduleID}.`);
      return res.status(404).json({ message: 'Module not found' });
    }

    // Log success if module updated (information log)
    moduleLogger.info(`Module updated: ${moduleID} with new values (${moduleName}, ${moduleCode}).`);
    res.status(200).json({ message: 'Module updated successfully' });
  } catch (error) {
    // Log error when updating module fails
    moduleLogger.error(`Error updating module ${moduleID}: ${error.message}`, { error });
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
        // Log a warning if module not found (warning log)
        moduleLogger.warn(`Module not found for deletion: ${moduleID}.`);
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Log success if module deleted (information log)
      moduleLogger.info(`Module deleted: ${moduleID}.`);
      res.status(200).json({ message: 'Module deleted successfully, along with any related assignments, submissions, and feedback.' });
    } catch (error) {
      // Log error when deleting module fails (error log)
      moduleLogger.error(`Error deleting module ${moduleID}: ${error.message}`, { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  };