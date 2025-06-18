
// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // اسم الفئة
  image: { type: String, required: true },               // رابط الصورة
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
