const router = require('express').Router();
const Booking = require('../models/Booking');
const Table   = require('../models/Table');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { tableId, date, time, guests, duration, discountCode } = req.body;
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const conflicts = await Booking.find({ table: tableId, date, status: { $in: ['pending','confirmed'] } });
    const reqHour = parseInt(time.split(':')[0]);
    const blocked = conflicts.some(b => Math.abs(parseInt(b.time.split(':')[0]) - reqHour) < (b.duration || 2));
    if (blocked) return res.status(400).json({ message: 'Table already booked at this time' });

    let discountPercent = 0;
    if (discountCode) {
      const u = await User.findById(req.user._id);
      const disc = u.discounts.find(d => d.code === discountCode && !d.used && new Date(d.expiresAt) > new Date());
      if (disc) {
        discountPercent = disc.percent;
        disc.used = true;
        await u.save();
      }
    }

    const booking = await Booking.create({
      user: req.user._id, table: tableId, date, time,
      duration: duration || 2, guests, discountCode, discountPercent
    });
    await booking.populate(['user', 'table']);
    res.status(201).json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('table')
      .populate({ path: 'orders', populate: { path: 'items.menuItem' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Booking.find()
      .populate('user', 'name email phone')
      .populate('table')
      .sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id)
      .populate('table')
      .populate('user', 'name email phone')
      .populate({ path: 'orders', populate: { path: 'items.menuItem' } });
    if (!b) return res.status(404).json({ message: 'Not found' });
    if (b.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    res.json(b);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    if (b.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    b.status = 'cancelled';
    await b.save();
    res.json(b);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/spin-wheel', protect, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    if (b.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    if (b.wheelSpun) return res.status(400).json({ message: 'Already spun' });
    if (b.payment.status !== 'confirmed') return res.status(400).json({ message: 'Payment not confirmed' });
    if (b.totalAmount < 2500) return res.status(400).json({ message: 'Min 2500₸ required' });

    const code = 'COFFESINO-' + Math.random().toString(36).substr(2, 6).toUpperCase() + '-10';
    b.wheelSpun = true;
    b.wheelDiscount = { code, percent: 10 };
    await b.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { discounts: { code, percent: 10, used: false, expiresAt: new Date(Date.now() + 30*24*60*60*1000) } }
    });

    res.json({ code, percent: 10 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
