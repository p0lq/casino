require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', name: 'COFFESINO API' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedAdmin();
  })
  .catch(err => console.error('MongoDB error:', err));

async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
    await User.create({
      name: 'Admin COFFESINO',
      email: process.env.ADMIN_EMAIL || 'admin@coffesino.kz',
      password: hash,
      phone: '+77787286567',
      role: 'admin'
    });
    console.log('Admin created:', process.env.ADMIN_EMAIL);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`COFFESINO API running on port ${PORT}`));
