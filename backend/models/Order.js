const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name:     String,
  price:    Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  booking:     { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [orderItemSchema],
  totalAmount: { type: Number, default: 0 },
  status:      { type: String, enum: ['pending','confirmed','preparing','ready','delivered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
