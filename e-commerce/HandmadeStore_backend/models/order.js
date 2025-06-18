const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  city: String,
  address: String,
  contact: String,
  paymentMethod: String,
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
