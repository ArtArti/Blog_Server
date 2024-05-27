const express = require('express');
const sellerRouter = express.Router();
const { createPropertyPost, getAllPropertyPosts, editPropertyPost, likePropertyPost, getPostBySellerId } = require('../Controller/sellerController');
const {isLoggedIn} = require('../MIddleWare/jwtAuth')
// Route to create a new property post
sellerRouter.post('/posts', createPropertyPost);

// Route to get all property posts
sellerRouter.get('/posts', getAllPropertyPosts);


// Route to edit a property post
sellerRouter.put('/posts/:id', editPropertyPost);
sellerRouter.put('/posts/:id/like', likePropertyPost);
sellerRouter.get('/posts/:sellerId',getPostBySellerId);

module.exports = sellerRouter;
