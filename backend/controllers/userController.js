import pool from '../db.js';

// Function to get user info
export const getUser = async (req, res) => {
  try {
    const { userID } = req.user; // Extract userID from JWT

    // Fetch the user's data based on userID
    const [rows] = await pool.execute(
      'SELECT username, firstName, lastName, email, userType FROM users WHERE userID = ?',
      [userID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's data
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Update current user's info
export const updateUser = async (req, res) => {
  const { userID } = req.user; // Extract userID from JWT
  const { firstName, lastName, phoneNum } = req.body;

  try {
    const [rows] = await pool.execute('SELECT username FROM users WHERE userID = ?', [userID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.execute(
      'UPDATE users SET firstName = ?, lastName = ?, phoneNum = ? WHERE userID = ?',
      [firstName, lastName, phoneNum, userID]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};