const router = require('express').Router();
const Order    = require('../models/Order');
const Booking  = require('../models/Booking');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, items } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const mi = await MenuItem.findById(item.menuItemId);
      if (mi && mi.available) {
        total += mi.price * item.quantity;
        orderItems.push({ menuItem: mi._id, name: mi.name.ru, price: mi.price, quantity: item.quantity });
      }
    }

    const order = await Order.create({ booking: bookingId, user: req.user._id, items: orderItems, totalAmount: total });

    let newTotal = total;
    if (booking.discountPercent > 0) newTotal = total * (1 - booking.discountPercent / 100);
    await Booking.findByIdAndUpdate(bookingId, { $push: { orders: order._id }, $inc: { totalAmount: newTotal } });

    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Order.find()
      .populate('booking', 'date time table')
      .populate('user', 'name')
      .sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
