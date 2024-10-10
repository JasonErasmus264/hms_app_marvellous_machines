import pool from '../db.js';
import { userModuleLogger } from '../middleware/logger.js';


// Get users not enrolled in a specific module, excluding Admin users
export const getNotEnrolledUsers = async (req, res) => {
  const { moduleID } = req.params; // Get moduleID from the request params

  // Log information about fetching not enrolled users
  userModuleLogger.info(`Fetching users not enrolled in moduleID: ${moduleID}`);

  try {
    // Fetch users who are not enrolled in the module and are not Admins
    const [notEnrolledUsers] = await pool.execute(
      `SELECT u.userID, u.firstName, u.lastName, u.username, u.userType 
       FROM users u
       LEFT JOIN user_module um ON u.userID = um.userID AND um.moduleID = ?
       WHERE um.userID IS NULL AND u.userType != 'Admin'`,
      [moduleID]
    );

    // Format the response
    const formattedNotEnrolledUsers = notEnrolledUsers.map(user => ({
      userID: user.userID,
      user: `${user.firstName} ${user.lastName} (${user.username})`
    }));

    // Log success
    userModuleLogger.info(`Successfully fetched users not enrolled in moduleID: ${moduleID}`);

    // Send response
    res.json({ notEnrolledUsers: formattedNotEnrolledUsers });
  } catch (error) {
    // Log error
    userModuleLogger.error(`Error fetching not enrolled users for moduleID ${moduleID}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};







// Get users enrolled in a specific module
export const getEnrolledUsers = async (req, res) => {
  const { moduleID } = req.params; // Get moduleID from the request params

  // Log information about fetching enrolled users
  userModuleLogger.info(`Fetching enrolled users for moduleID: ${moduleID}`);

  try {
    // Fetch users enrolled in the module
    const [enrolledUsers] = await pool.execute(
      `SELECT u.userID, u.firstName, u.lastName, u.username, u.userType 
       FROM users u
       JOIN user_module um ON u.userID = um.userID
       WHERE um.moduleID = ?`,
      [moduleID]
    );

    // Format the response
    const formattedEnrolledUsers = enrolledUsers.map(user => ({
      userID: user.userID,
      user: `${user.firstName} ${user.lastName} (${user.username})`
    }));

    // Log success
    userModuleLogger.info(`Successfully fetched enrolled users for moduleID: ${moduleID}`);

    // Send response
    res.json({ enrolledUsers: formattedEnrolledUsers });
  } catch (error) {
    // Log error
    userModuleLogger.error(`Error fetching enrolled users for moduleID ${moduleID}: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};







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
    userModuleLogger.info(`User ${userID} successfully added to module ${moduleID}`);
    res.status(201).json({ message: 'User successfully added to the module' });
  } catch (error) {
    // Log error when adding user fails (error log)
    userModuleLogger.error(`Error adding user to module: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Delete a user from a module
export const deleteUserFromModule = async (req, res) => {
  const { userID, moduleID } = req.params;

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
      userModuleLogger.warn(`User ${userID} not found in module ${moduleID}`);
      return res.status(404).json({ message: 'User not found in the specified module' });
    }

    // Log success if user removed from module (information log)
    userModuleLogger.info(`User ${userID} successfully removed from module ${moduleID}`);
    res.status(200).json({ message: 'User successfully removed from the module' });
  } catch (error) {
    // Log error when deleting user fails (error log)
    userModuleLogger.error(`Error deleting user from module: ${error.message}`, { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};