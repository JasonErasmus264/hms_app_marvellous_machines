import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // To promisify jwt.verify for async/await

const verifyToken = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Malformed token' });
    }

    // Verify the token (promisify jwt.verify for cleaner async/await code)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;
    
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // Catch any other unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default verifyToken;