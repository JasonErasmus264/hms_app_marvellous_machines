import pool from '../db.js';

export const getUser = async (req, res) => {
  try {
    const { userID } = req.user; // Extract userID from JWT

    // Fetch the user's data including createdAt and phoneNum fields
    const [rows] = await pool.execute(
      'SELECT username, firstName, lastName, email, phoneNum, userType, createdAt FROM users WHERE userID = ?',
      [userID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    
    // Format the createdAt field to the desired format (e.g., "July 12th, 2023")
    const formattedCreatedAt = formatDate(new Date(user.createdAt));

    // Return the user's data including the formatted createdAt and phoneNum
    res.json({
      user: {
        ...user,
        createdAt: formattedCreatedAt, // Include the formatted createdAt
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to format dates to 'July 12th, 2023'
const formatDate = (date) => {
  const options = {
    day: 'numeric',
    month: 'long', // Full month name
    year: 'numeric',
  };

  const day = date.getDate();
  const ordinalDay = getOrdinalSuffix(day);
  
  // Format the date (e.g., "July 12th, 2023")
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate.replace(day, `${ordinalDay}`);
};

// Helper function to get the ordinal suffix (st, nd, rd, th)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return `${day}th`; // Teens are always "th"
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
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