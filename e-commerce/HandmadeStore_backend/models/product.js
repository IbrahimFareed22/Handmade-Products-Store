// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // رابط الصورة
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // الربط مع نموذج الفئة
    required: true,
  }
});

module.exports = mongoose.model("Product", productSchema);
