import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';

// Failed login attempts tracking (in-memory, per IP)
const failedLoginAttempts = new Map();

// Time window (in milliseconds) for login attempt tracking
const LOGIN_ATTEMPT_WINDOW = process.env.LOGIN_RATE_LIMIT_WINDOW * 60 * 1000;
const MAX_ATTEMPTS = process.env.LOGIN_RATE_LIMIT_MAX || 5; // Default to 5 if not set

// Function to check and track failed attempts
const trackFailedAttempt = (ip) => {
  const currentTime = Date.now();
  let attempts = failedLoginAttempts.get(ip) || { count: 0, lastAttemptTime: currentTime };

  // If the window has passed, reset the counter
  if (currentTime - attempts.lastAttemptTime > LOGIN_ATTEMPT_WINDOW) {
    attempts = { count: 1, lastAttemptTime: currentTime };
  } else {
    attempts.count += 1;
  }

  failedLoginAttempts.set(ip, attempts);
  return attempts.count >= MAX_ATTEMPTS;
};

// Function to reset failed attempts on successful login
const resetFailedAttempts = (ip) => {
  failedLoginAttempts.delete(ip);
};

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  const userIP = req.ip; // Get user's IP address

  // Check if the IP is already blocked due to too many attempts
  const isBlocked = trackFailedAttempt(userIP);

  if (isBlocked) {
    return res.status(429).json({
      message: 'Too many login attempts. Please try again later.',
    });
  }

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

    // Reset failed attempts on successful login
    resetFailedAttempts(userIP);

    // Generate Access Token with userID and userType
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

    // Respond without sending userID
    return res.json({
      accessToken,
      refreshToken, // Return refresh token in the response
      userType: user.userType,
    });

  } catch (error) {
    // Track failed login attempts on error
    trackFailedAttempt(userIP);
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  const refreshToken = authHeader.split(' ')[1];

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

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { userID: user.userID, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
      );

      // Generate a new refresh token
      const newRefreshToken = jwt.sign(
        { userID: user.userID, userType: user.userType },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
      );

      // Hash and store the new refresh token
      const hashedNewRefreshToken = bcryptjs.hashSync(newRefreshToken, 10);
      await pool.execute('UPDATE users SET refreshToken = ? WHERE userID = ?', [hashedNewRefreshToken, user.userID]);

      // Respond without sending userID
      return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userType: user.userType, // No userID in the response
      });
    });
  } catch (err) {
    console.error('Error during token refresh:', err);
    return res.status(500).json({ message: 'Error refreshing token' });
  }
};



// Logout
export const logout = async (req, res) => {
  // Get userID from req.user, which is populated by verifyToken middleware
  const { userID } = req.user;

  try {
    // Set refreshToken to NULL for the logged-out user
    await pool.execute('UPDATE users SET refreshToken = NULL WHERE userID = ?', [userID]);

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error logging out' });
  }
};




// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const [rows] = await pool.execute('SELECT userID FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const userID = rows[0].userID;

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes

    // Store reset code and expiry in the database
    await pool.execute('UPDATE users SET resetCode = ?, codeExpiry = ? WHERE userID = ?', [resetCode, codeExpiry, userID]);

    // Setup email transporter (Outlook configuration)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hi,</p>
          <p>You recently requested to reset your password for your account. Please use the following code to reset your password. This code is valid for <strong>10 minutes</strong>:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background-color: #f4f4f4; padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; display: inline-block;">${resetCode}</span>
          </div>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Thank you,</p>
          <p>Your Support Team</p>
        </div>
      `,
    };

    // Send the email with the reset code
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Password reset code sent to your email. Please check your inbox or junk folder.' 
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Verify Reset Code
export const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    // Fetch reset code and expiry from the database
    const [rows] = await pool.execute('SELECT resetCode, codeExpiry FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const { resetCode: storedResetCode, codeExpiry } = rows[0];

    // Check if the reset code has expired
    if (Date.now() > codeExpiry) {
      return res.status(400).json({ message: 'Reset code expired.' });
    }

    // Validate the reset code
    if (resetCode !== storedResetCode) {
      return res.status(400).json({ message: 'Invalid reset code.' });
    }

    res.status(200).json({ message: 'Reset code verified successfully.' });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Strong password validation (at least 8 characters, one uppercase, one lowercase, one number, one special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }

  try {
    // Fetch user by email
    const [rows] = await pool.execute('SELECT userID FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const userID = rows[0].userID;

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the password and clear reset code and expiry
    await pool.execute('UPDATE users SET password = ?, resetCode = NULL, codeExpiry = NULL WHERE userID = ?', [hashedPassword, userID]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};