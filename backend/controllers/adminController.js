





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