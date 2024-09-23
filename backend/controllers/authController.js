import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';
import { authLogger } from '../middleware/logger.js'; // import auth logger

// Login rate limiter: max attempts configurable via .env
export const loginLimiter = rateLimit({
  windowMs: process.env.LOGIN_RATE_LIMIT_WINDOW * 60 * 1000, // minutes to milliseconds
  max: process.env.LOGIN_RATE_LIMIT_MAX,
  message: 'Too many login attempts from this IP, please try again later.',
  headers: true,
});

// Login function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      // Log a warning when an invalid username is used for login (warning log)
      authLogger.warn(`Login attempt failed: invalid username`); 
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
      // Log a warning when the password is incorrect (warning log)
      authLogger.warn(`Login attempt failed for user: ${username}, invalid password`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      { userID: user.userID, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { userID: user.userID, userType: user.userType },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    // Store hashed refresh token in the database
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    await pool.execute('UPDATE users SET refreshToken = ? WHERE userID = ?', [hashedRefreshToken, user.userID]);

    // Securely store refresh token in an HTTP-Only, Secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    // Log success when a user successfully logs in (information log)
    authLogger.info(`User ${username} logged in successfully`); 

    return res.json({
      accessToken,
      userID: user.userID,
      userType: user.userType,
    });

  } catch (error) {
    // Log an error when an exception occurs during login (error log)
    authLogger.error(`Login error: ${error.message}`, { error }); 
    res.status(500).json({ error });
  }
};

// Refresh token function
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    // Log a warning if no refresh token is provided in the request (warning log)
    authLogger.warn(`No refresh token provided for user: ${username}`); 
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE refreshToken IS NOT NULL');
    const user = rows.find(u => bcryptjs.compareSync(refreshToken, u.refreshToken));

    if (!user) {
      // Log a warning if the refresh token is invalid (warning log)
      authLogger.warn(`Invalid refresh token for user: ${username}`); 
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        // Log a warning if the refresh token is expired or invalid (warning log)
        authLogger.warn(`Invalid or expired refresh token for user: ${username}`);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      const newAccessToken = jwt.sign(
        { userID: user.userID, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
      );

      const newRefreshToken = jwt.sign(
        { userID: user.userID, userType: user.userType },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
      );

      const hashedNewRefreshToken = bcryptjs.hashSync(newRefreshToken, 10);
      await pool.execute('UPDATE users SET refreshToken = ? WHERE userID = ?', [hashedNewRefreshToken, user.userID]);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000,
      });
      // Log success when a refresh token is issued (informational log)
      authLogger.info(`Refresh token successfully issued for user: ${user.userID}`);
      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    // Log an error if an exception occurs during the refresh token process (error log)
    authLogger.error(`Error during token refresh for user: ${username}: ${err.message}`, { err });
    return res.status(500).json({ message: 'Error refreshing token' });
  }
};

// Logout function
export const logout = async (req, res) => {
  const { userID } = req.body;

  try {
    await pool.execute('UPDATE users SET refreshToken = NULL WHERE userID = ?', [userID]);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    // Log success when a user logs out successfully (informational log)
    authLogger.info(`User ${userID} logged out successfully`);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    // Log an error if something goes wrong during logout (error log)
    authLogger.error(`Logout error for user: ${userID}: ${err.message}`, { err });
    return res.status(500).json({ message: 'Error logging out' });
  }
};