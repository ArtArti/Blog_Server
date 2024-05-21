const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  likes: { type: Number, default: 0 }
  // Add other fields relevant to the seller or property
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
