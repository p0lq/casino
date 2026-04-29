const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table:    { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date:     { type: String, required: true },
  time:     { type: String, required: true },
  duration: { type: Number, default: 2 },
  guests:   { type: Number, required: true },
  status:   { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  orders:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  totalAmount: { type: Number, default: 0 },
  payment: {
    status:           { type: String, enum: ['pending','uploaded','verifying','confirmed','failed'], default: 'pending' },
    screenshotUrl:    String,
    screenshotPublicId: String,
    aiResult:         mongoose.Schema.Types.Mixed,
    verifiedAt:       Date,
    verifiedBy:       { type: String, enum: ['ai','admin'] }
  },
  discountCode:    String,
  discountPercent: { type: Number, default: 0 },
  wheelSpun:       { type: Boolean, default: false },
  wheelDiscount: {
    code:    String,
    percent: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
