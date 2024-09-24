import pool from '../db.js';
import { userModuleLogger } from '../middleware/logger.js';

// Add a user to a module
export const addUserToModule = async (req, res) => {
  const { userID, moduleID } = req.body;

  if (!userID || !moduleID) {
    // Log a warning if missing required fields (warning log)
    userModuleLogger.warn('User ID and Module ID are required');
    return res.status(400).json({ message: 'User ID and Module ID are required' });
  }

  try {
    // Insert into user_module
    await pool.execute(
      'INSERT INTO user_module (userID, moduleID) VALUES (?, ?)',
      [userID, moduleID]
    );

    // Log success if user added (information log)
    userModuleLogger.info(`User: ${username}, successfully added to module: ${moduleID}`);
    res.status(201).json({ message: 'User successfully added to the module' });
  } catch (error) {
    // Log error when adding user fails (error log)
    userModuleLogger.error(`Error adding user: ${username}, to module: ${moduleID}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Delete a user from a module
export const deleteUserFromModule = async (req, res) => {
  const { userID, moduleID } = req.body;

  if (!userID || !moduleID) {
    // Log a warning if missing required fields (warning log)
    userModuleLogger.warn('User ID and Module ID are required');
    return res.status(400).json({ message: 'User ID and Module ID are required' });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM user_module WHERE userID = ? AND moduleID = ?',
      [userID, moduleID]
    );

    if (result.affectedRows === 0) {
      // Log a warning if user not found (warning log)
      userModuleLogger.warn(`User: ${username}, not found in module: ${moduleID}`);
      return res.status(404).json({ message: 'User not found in the specified module' });
    }

    // Log success if user removed from module (information log)
    userModuleLogger.info(`User: ${username}, successfully removed from module: ${moduleID}`);
    res.status(200).json({ message: 'User successfully removed from the module' });
  } catch (error) {
    // Log error when deleting user fails (error log)
    userModuleLogger.error(`Error deleting user: ${username}, from module: ${moduleID}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};