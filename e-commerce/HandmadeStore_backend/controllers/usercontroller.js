const express = require('express');
const router = express.Router();
const User =require('../models/user') // تأكد من المسار الصحيح للموديل

const userregister= async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // التأكد من عدم وجود المستخدم مسبقًا
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("❌ Registration error:", err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Save user ID in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

  // GET /api/users/:id
  const getUser = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  // PATCH /api/users/:id
const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
  
      res.json({ message: "User updated", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  // DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
  
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  // to make require  that funcs in routes 
module.exports = {
    userregister,
    userlogin,
    getUser,
    updateUser,
    deleteUser

};

