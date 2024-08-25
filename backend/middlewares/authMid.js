import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json({ msg: "Token verification failed, authorization denied" });

    req.user = verified;  // Attaches the user data (from the token) to req.user
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default auth;
