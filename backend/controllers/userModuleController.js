import pool from '../db.js';

// Add a user to a module
export const addUserToModule = async (req, res) => {
  const { userID, moduleID } = req.body;

  if (!userID || !moduleID) {
    return res.status(400).json({ message: 'User ID and Module ID are required' });
  }

  try {
    // Insert into user_module
    await pool.execute(
      'INSERT INTO user_module (userID, moduleID) VALUES (?, ?)',
      [userID, moduleID]
    );

    res.status(201).json({ message: 'User successfully added to the module' });
  } catch (error) {
    console.error('Error adding user to module:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Delete a user from a module
export const deleteUserFromModule = async (req, res) => {
  const { userID, moduleID } = req.body;

  if (!userID || !moduleID) {
    return res.status(400).json({ message: 'User ID and Module ID are required' });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM user_module WHERE userID = ? AND moduleID = ?',
      [userID, moduleID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found in the specified module' });
    }

    res.status(200).json({ message: 'User successfully removed from the module' });
  } catch (error) {
    console.error('Error deleting user from module:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};