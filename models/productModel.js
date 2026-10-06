const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String, // stores the image path, e.g. /uploads/product-123.jpg
    default: null
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // adds createdAt + updatedAt automatically
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
