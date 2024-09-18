import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
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

    return res.json({
      accessToken,
      userID: user.userID,
      userType: user.userType,
    });

  } catch (error) {
    console.error('Login error:', error); // Log error for debugging
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

// Refresh token function
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE refreshToken IS NOT NULL');
    const user = rows.find(u => bcryptjs.compareSync(refreshToken, u.refreshToken));

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
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

      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error('Error during token refresh:', err);
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

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err); // Log error for debugging
    return res.status(500).json({ message: 'Error logging out' });
  }
};
