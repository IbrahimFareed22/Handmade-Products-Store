const express = require('express');
const multer  = require('multer');
const path    = require('path');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getProductsByCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// RESTful Routes
router.post('/',               upload.single('image'), createCategory);
router.get('/',                getAllCategories);
router.get('/:id/products',    getProductsByCategory);  // ← هذا السطر الجديد
router.delete('/:id',          deleteCategory);
router.put('/:id', upload.single('image'), updateCategory);

module.exports = router;
