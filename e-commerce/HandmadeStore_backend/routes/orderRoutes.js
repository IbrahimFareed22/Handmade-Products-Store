const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // ⭐ استدعاء الموديل

router.post('/', async (req, res) => {
  try {
    const { city, address, contact, paymentMethod, cart } = req.body;

    if (!city || !address || !contact || !paymentMethod || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid order data' });
    }

    // ⭐ تخزين الأوردر في الداتابيز
    const newOrder = new Order({
      city,
      address,
      contact,
      paymentMethod,
      cart
    });

    await newOrder.save(); // ✅ الحفظ الفعلي

    console.log('✅ Order Saved:', newOrder);

    res.status(201).json({ message: 'Order confirmed and saved successfully' });
  } catch (err) {
    console.error('❌ Order Error:', err.message);
    res.status(500).json({ message: 'Server error while confirming order' });
  }
});

module.exports = router;
