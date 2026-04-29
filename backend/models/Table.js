const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number:    { type: Number, required: true, unique: true },
  seats:     { type: Number, required: true },
  description: {
    ru: String,
    kz: String,
    en: String
  },
  image:     { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
