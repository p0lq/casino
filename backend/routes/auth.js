const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, discounts: u.discounts });

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Fill all fields' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: token(user._id), user: safeUser(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: token(user._id), user: safeUser(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(safeUser(user));
});

module.exports = router;
