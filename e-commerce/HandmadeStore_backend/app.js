const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const path    = require('path');
const session = require('express-session');
const mongoose = require('mongoose');

dotenv.config();

const categoryRouter = require('./routes/categoryRoutes');
const productRouter  = require('./routes/productRoutes');
const cartRouter     = require('./routes/cartRoutes');
const Admin          = require('./models/admin');
const userRouter     = require('./routes/userRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');

const app = express();

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Admin routes
app.post('/api/admins', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/api/admins/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    if (admin.password !== password) return res.status(400).json({ error: 'Invalid Password' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});
const orderRoutes = require('./routes/orderRoutes');
// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/cart', cartRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

module.exports = app;
