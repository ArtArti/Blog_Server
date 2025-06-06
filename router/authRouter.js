const express = require("express");
const { signUp, signIn, getUser, logOut, checkAuth} = require("../Controller/authController");
const {isLoggedIn, authorizeRoles} = require("../MIddleWare/jwtAuth")
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/user',isLoggedIn, getUser);
authRouter.get('/check',checkAuth);
authRouter.post('/logout',isLoggedIn, logOut);


authRouter.get('/buyer',isLoggedIn, authorizeRoles('buyer'), (req, res) => {
    res.status(200).json({ message: 'Buyer access' });
  });
  
authRouter.get('/seller', isLoggedIn, authorizeRoles('seller'), (req, res) => {
    res.status(200).json({ message: 'seller access' });
  });

module.exports = authRouter;