import bcryptjs from 'bcryptjs';
import pool from '../db.js';


// Get All Users
// Function to get all users with only userID and formatted username
export const getAllUsers = async (req, res) => {
  try {
    // Execute query to get the userID, username, firstName, and lastName
    const [rows] = await pool.execute('SELECT userID, username, firstName, lastName FROM users');

    // Map the result to include only userID and formatted username
    const users = rows.map(user => ({
      userID: user.userID,
      user: `${user.username} (${user.firstName} ${user.lastName})`, // Formatted as "username (firstName lastName)"
    }));

    // Return the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Get User Info by userID
export const getUserInfo = async (req, res) => {
  const { userID } = req.params;

  try {
    // Execute query to get detailed user info by userID
    const [rows] = await pool.execute(
      'SELECT firstName, lastName, phoneNum, userType FROM users WHERE userID = ?',
      [userID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Return the detailed user info
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNum: user.phoneNum,
      userType: user.userType,
    });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Creating a new user //

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
  const { firstName, lastName, phoneNum, userType } = req.body; // Destructure the data from the request

  try {
    // Validate required fields
    if (!firstName || !lastName || !phoneNum || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate a unique username
    let username;
    do {
      username = generateUsername(); // Generate random username
    } while (!(await isUsernameUnique(username))); // Repeat until a unique username is found

    // Generate email based on username
    const email = `${username}@mynwu.ac.za`;
    const password = `${username}@Nwu`; // Generate a default password based on the username

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10); // Hash password with bcryptjs

    // Insert the new user into the database
    await pool.execute(
      'INSERT INTO users (username, firstName, lastName, password, email, phoneNum, userType) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, firstName, lastName, hashedPassword, email, phoneNum, userType]
    );

    // Send success response
    res.status(201).json({ message: 'User created successfully'});
  } catch (error) {
    // Handle any errors and send failure response
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Update a user
export const updateUser = async (req, res) => {
  const { userID } = req.params; // Extract userID from the route
  const { firstName, lastName, phoneNum, userType } = req.body; // Extract fields from the request body

  // Validate that all required fields are provided
  if (!firstName || !lastName || !phoneNum || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT * FROM users WHERE userID = ?',
      [userID]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.execute(
      'UPDATE users SET firstName = ?, lastName = ?, phoneNum = ?, userType = ? WHERE userID = ?',
      [firstName, lastName, phoneNum, userType, userID]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Delete a user
export const deleteUser = async (req, res) => {
  const { userID } = req.params;

  try {
    // Check if the user exists
    const [existingUser] = await pool.execute(
      'SELECT userID FROM users WHERE userID = ?',
      [userID]
    );

    
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Execute the delete query
    await pool.execute('DELETE FROM users WHERE userID = ?', [userID]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};