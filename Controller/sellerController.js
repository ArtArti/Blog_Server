const Seller = require('../Model/sellerSchema');

// Controller function to create a new property post
const createPropertyPost = async (req, res) => {
  try {
    const { description, price } = req.body;
    const newPost = await Seller.create({ description, price });
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller function to get all property posts
const getAllPropertyPosts = async (req, res) => {
  try {
    const allPosts = await Seller.find();
    res.status(200).json({ success: true, data: allPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Controller function to edit a property post
const editPropertyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, price } = req.body;

    const updatedPost = await Seller.findByIdAndUpdate(id, { description, price }, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const likePropertyPost = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the post by its ID
      const post = await Seller.findById(id);
  
      // If the post doesn't exist, return an error
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
  
      // Increment the likes count
      post.likes += 1;
  
      // Save the updated post
      await post.save();
  
      // Return the updated post
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };

module.exports = { createPropertyPost, getAllPropertyPosts, editPropertyPost, likePropertyPost };
