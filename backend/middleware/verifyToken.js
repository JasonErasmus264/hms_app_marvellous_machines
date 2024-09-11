import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token is provided
  if (!token) {
    console.error('Token not provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = user; // Store the decoded user information in req.user
    next(); // Proceed to the next middleware or route handler
  });
};

export default verifyToken;