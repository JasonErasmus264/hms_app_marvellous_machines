export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const { userType } = req.user; // Extract userType from the token
  
      // Check if the user's role is in the allowedRoles array
      if (!allowedRoles.includes(userType)) {
        return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
      }
  
      // If user is authorized, move to the next middleware
      next();
    };
  };