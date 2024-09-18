import bcryptjs from 'bcryptjs';
import pool from '../db.js';

// Function to get user info
export const getUserInfo = async (req, res) => {
  try {
    const { userID } = req.user;

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

// Function to generate a random 6-digit username
const generateUsername = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to check if a username already exists
const isUsernameUnique = async (username) => {
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE username = ?', [username]);
  return rows[0].count === 0;
};

// Function to create a user
export const createUser = async (req, res) => {
  const { firstName, lastName, phoneNum, userType } = req.body;

  try {
    // Generate a unique username
    let username;
    do {
      username = generateUsername();
    } while (!(await isUsernameUnique(username)));

    // Generate the email and password
    const email = `${username}@mynwu.ac.za`;
    const password = `${username}@Nwu`;

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the user into the database
    await pool.execute(
      'INSERT INTO users (username, firstName, lastName, password, email, phoneNum, userType) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, firstName, lastName, hashedPassword, email, phoneNum, userType]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
