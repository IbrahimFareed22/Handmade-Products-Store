// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

// Middleware to initialize session storage-like behavior
const sessionStorage = new Map(); // Simulates session storage on the server

function getSessionCart(sessionId) {
  if (!sessionStorage.has(sessionId)) {
    sessionStorage.set(sessionId, []);
  }
  return sessionStorage.get(sessionId);
}

// 🛒 Add to cart
router.post('/AddToCart', async (req, res) => {
  try {
    const sessionId = req.sessionID; // Use session ID as the key
    const productId = req.body.id;
    const foundProduct = await Product.findById(productId);
    if (!foundProduct) return res.status(404).json({ error: 'Product not found' });

    let cart = getSessionCart(sessionId);
    let existingItem = cart.find(item => item.id === foundProduct._id.toString());

    if (existingItem) {
      // Update quantity if product already exists in cart
      existingItem.qty += 1;
    } else {
      // Add new item to cart
      cart.push({
        id: foundProduct._id.toString(),
        title: foundProduct.name,
        qty: 1,
        price: parseFloat(foundProduct.price).toFixed(2),
        Image: foundProduct.image,
        slug: foundProduct.name
      });
    }

    sessionStorage.set(sessionId, cart); // Save updated cart
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Error adding to cart' });
  }
});

// 🧺 View cart
router.get('/checkout', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const cart = getSessionCart(sessionId);
    res.json(cart);
  } catch (err) {
    console.error('Error retrieving cart:', err);
    res.status(500).json({ error: 'Error retrieving cart' });
  }
});

// 📝 Update quantity
router.post('/update/:product', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const { qty } = req.body;
    const productId = req.params.product;

    let cart = getSessionCart(sessionId);
    const item = cart.find(p => p.id === productId);

    if (item) {
      item.qty = qty;
    }

    sessionStorage.set(sessionId, cart); // Save updated cart
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// ❌ Remove item
router.post('/remove/:product', (req, res) => {
  try {
    const sessionId = req.sessionID;
    const productId = req.params.product;

    let cart = getSessionCart(sessionId);
    cart = cart.filter(p => p.id !== productId);

    sessionStorage.set(sessionId, cart); // Save updated cart
    res.json({ message: 'Item removed', cart });
  } catch (err) {
    console.error('Error removing item:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// 🧹 Clear cart
router.get('/clear', (req, res) => {
  try {
    const sessionId = req.sessionID;
    sessionStorage.set(sessionId, []); // Clear cart
    res.json({ message: 'Cart cleared', cart: [] });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
