const express = require("express");
const { signUp, signIn, getUser, logOut} = require("../Controller/authController");
const {jwtAuth, authorizeRoles } = require("../MIddleWare/jwtAuth")
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/user',jwtAuth, getUser);
authRouter.get('/logout',jwtAuth, logOut);

authRouter.get('/buyer', jwtAuth, authorizeRoles('buyer'), (req, res) => {
    res.status(200).json({ message: 'Buyer access' });
  });
  
  authRouter.get('/seller', jwtAuth, authorizeRoles('seller'), (req, res) => {
    res.status(200).json({ message: 'seller access' });
  });

module.exports = authRouter;