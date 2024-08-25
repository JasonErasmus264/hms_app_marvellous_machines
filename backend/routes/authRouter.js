import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js'; // Adjust the import path if needed
import verifyToken from '../middleware/verifyToken.js'; // Adjust the import path if needed

const authRouter = express.Router();

// Login route
authRouter.post('/api/v1/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcryptjs.compare(password, user.password);

    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Access Token
    const accessToken = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Generate Refresh Token
    const refreshToken = jwt.sign({ userID: user.userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Hash the refresh token before storing it in the database
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);

    // Store the hashed refresh token in the database
    await pool.execute('UPDATE users SET refreshToken = ? WHERE userID = ?', [hashedRefreshToken, user.userID]);

    // Return only the tokens
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh Token route
authRouter.post('/api/v1/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized if no refresh token is provided

  try {
    // Verify the provided refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Fetch the user and the hashed refresh token from the database
    const [rows] = await pool.execute('SELECT * FROM users WHERE userID = ?', [decoded.userID]);

    if (rows.length === 0) return res.sendStatus(403); // Forbidden if user not found

    const user = rows[0];

    // Compare the hashed refresh token with the one provided
    const match = await bcryptjs.compare(refreshToken, user.refreshToken);

    if (!match) return res.sendStatus(403); // Forbidden if refresh tokens do not match

    // Generate a new access token
    const newAccessToken = jwt.sign({ userID: decoded.userID }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// Get current user (protected route)
authRouter.get('/api/v1/user', verifyToken, async (req, res) => {
  try {
    const { userID } = req.user;

    // Fetch the user's data based on userID
    const [rows] = await pool.execute(
      'SELECT userID, username, firstName, lastName, email, userType FROM users WHERE userID = ?',
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
});

export default authRouter;