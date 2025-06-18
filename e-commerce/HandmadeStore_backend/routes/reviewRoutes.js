// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// مسار جلب المراجعات الخاصة بمنتج معين
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// مسار إضافة مراجعة جديدة
router.post('/', async (req, res) => {
  const { user, product, rating, comment } = req.body;

  if (!user || !product || !rating || !comment) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const newReview = new Review({ user, product, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Error saving review' });
  }
});

module.exports = router;
