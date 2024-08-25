import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/authMid.js';
import pool from '../db.js';

const authRouter = express.Router();

authRouter.post("/api/v1/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcryptjs.compare(password, user.password);

    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/api/v1/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE userID = ?',
      [verified.userID]
    );

    if (rows.length === 0) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user data
authRouter.get("/api/v1/auth/user", auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE userID = ?',
      [req.user.userID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    res.json({ user, token: req.token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default authRouter;