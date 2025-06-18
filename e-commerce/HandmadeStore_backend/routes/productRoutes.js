// module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} = require('../controllers/productController');

const router = express.Router();

// إعداد multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// المسارات
router.post('/', upload.single('image'), createProduct);
router.get('/', getAllProducts);           // هنا يستخدم الكويري ?categoryId=...
router.get('/:id', getProductById);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);


module.exports = router;
