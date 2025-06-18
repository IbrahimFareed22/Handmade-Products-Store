const Product = require('../models/product');
const Category = require('../models/category');

// إضافة منتج جديد
const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : '';

    if (!name || !price || !categoryId) {
      return res
        .status(400)
        .json({ error: 'Name, price و categoryId مطلوبة.' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'الفئة غير موجودة.' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category: category._id,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// جلب جميع المنتجات، مع فلترة اختيارية حسب categoryId في الكويري
const getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { category: categoryId } : {};
    const products = await Product.find(filter).populate('category');
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// تعديل منتج
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : undefined;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود.' });
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ error: 'الفئة غير موجودة.' });
      }
      product.category = category._id;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    if (image) product.image = image;

    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// حذف منتج
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'المنتج غير موجود.' });
    }
    return res.status(200).json({ message: 'تم حذف المنتج بنجاح.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
