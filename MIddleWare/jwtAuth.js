const JWT = require("jsonwebtoken");

// router level middleware function
const isLoggedIn = (req, res, next) => {
  // get cookie token(jwt token generated using json.sign()) form the request
  const token = (req.cookies && req.cookies.token) || null;

  // return response if there is no token(jwt token attached with cookie)
  if (!token) {
    return res.status(400).json({ success: false, message: "NOT authorized" });
  }

  // verify the token
  try {
    const payload = JWT.verify(token, process.env.SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
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

module.exports = {isLoggedIn, authorizeRoles};
