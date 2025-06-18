const Category = require('../models/category');
const Product  = require('../models/product');  // ← نضيف هنا الاستيراد

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new Category({ name, image });
    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : category.image; // ← استخدم الصورة الحالية إن لم تُرسل صورة جديدة

    category.name = name || category.name;
    category.image = image;

    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    // فلترة المنتجات حسب حقل category
    const products = await Product.find({ category: categoryId }).populate('category');
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getProductsByCategory
};
