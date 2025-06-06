const { compare } = require("bcrypt");
const userModel = require("../Model/userSchema");
const EmailValidator = require("email-validator");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



// 1: controller for registration
const signUp = async (req, res) => {
  const {name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  // all fields validations
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Every field is required',
    });
  }

  // email validation
  const validEmail = EmailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Inavalid Email",
    });
  }

  // password validation
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "your password and confirmPassword doesn't match",
    });
  }

  try {
    const userInfo = new userModel({ name, email, password,confirmPassword });
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Account already exists with the provided email ${email} 😒`,
      });
    }

    return res.status(400).json({
      message: e.message,
    });
  }
};



//2: controller for SignIn for user
const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Every field is required",
    });
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'lax', // 'none' if using cross-site + HTTPS
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
     token,
     user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 3: controller to get the user information
const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
    


const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Token missing.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET); // FIXED

    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Authenticated',
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};




//4: controller for logout the user
const logOut=(req, res)=>{

    try {
      const cookieOption={
        expires:new Date,
        httpOnly: true
      }
      res.cookie("token", null , cookieOption);
      res.status(200).json({
        success: true,
        message: "logged Out"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
}


module.exports = {
  signUp,
  signIn,
  getUser,
  logOut,
  checkAuth
};
