const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    ru: { type: String, required: true },
    kz: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ru: String,
    kz: String,
    en: String
  },
  category: {
    type: String,
    enum: ['coffee', 'tea', 'food', 'dessert', 'drinks', 'other'],
    required: true
  },
  price:     { type: Number, required: true },
  image:     { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
