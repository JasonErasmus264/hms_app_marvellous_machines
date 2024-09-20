export const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const { userType } = req.user;
  
      // Check if the user's role is allowed
      if (!allowedRoles.includes(userType)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
  
      next(); // User is authorized, proceed to next middleware or route handler
    };
};