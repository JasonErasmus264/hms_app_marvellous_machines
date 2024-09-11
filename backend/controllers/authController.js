import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Login function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    // Check if user exists
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized for incorrect username
    }

    const user = rows[0];

    // Check if the password matches
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized for incorrect password
    }

    // Generate Access Token
    let accessToken;
    try {
      accessToken = jwt.sign({ userID: user.userID, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '15m' });
    } catch (err) {
      console.error('Error generating access token:', err);
      return res.status(500).json({ message: 'Failed to generate access token' });
    }

    // Generate Refresh Token
    let refreshToken;
    try {
      refreshToken = jwt.sign({ userID: user.userID, userType: user.userType }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    } catch (err) {
      console.error('Error generating refresh token:', err);
      return res.status(500).json({ message: 'Failed to generate refresh token' });
    }

    // Hash the refresh token before storing it in the database
    let hashedRefreshToken;
    try {
      hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    } catch (err) {
      console.error('Error hashing refresh token:', err);
      return res.status(500).json({ message: 'Failed to hash refresh token' });
    }

    // Store the hashed refresh token in the database
    try {
      await pool.execute('UPDATE users SET refreshToken = ? WHERE userID = ?', [hashedRefreshToken, user.userID]);
    } catch (err) {
      console.error('Error storing hashed refresh token in the database:', err);
      return res.status(500).json({ message: 'Failed to update refresh token in the database' });
    }

    // Return the tokens and user info
    return res.json({
      accessToken,
      refreshToken,
      userID: user.userID,
      userType: user.userType
    });

  } catch (error) {
    // Handle unexpected errors (e.g., database connection issues)
    console.error('Unexpected error during login:', error);
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

// Refresh Token function
export const refreshToken = async (req, res) => {
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
};