const express = require('express');
const sellerRouter = express.Router();
const { createPropertyPost, getAllPropertyPosts, editPropertyPost, likePropertyPost } = require('../Controller/sellerController');

// Route to create a new property post
sellerRouter.post('/posts', createPropertyPost);

// Route to get all property posts
sellerRouter.get('/posts', getAllPropertyPosts);


// Route to edit a property post
sellerRouter.put('/posts/:id', editPropertyPost);
sellerRouter.put('/posts/:id/like', likePropertyPost);

module.exports = sellerRouter;
