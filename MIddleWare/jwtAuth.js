const JWT = require("jsonwebtoken");

const userModel = require('../Model/userSchema'); // Adjust path as needed


const isLoggedIn = async (req, res, next) => {
  // ✅ Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  const token = authHeader.split(' ')[1]; // extract actual token

  try {
    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // ✅ Find user by ID from token
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Optional middleware - doesn't block request if not authenticated
const optionalAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await userModel.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but don't block request
      console.log('Invalid token in optional auth');
    }
  }
  
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = {isLoggedIn, authorizeRoles,optionalAuth};
