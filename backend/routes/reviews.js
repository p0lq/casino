const router = require('express').Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    res.json(await Review.find({ approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { rating, text, bookingId } = req.body;
    if (!rating || !text) return res.status(400).json({ message: 'Rating and text required' });
    const review = await Review.create({
      user: req.user._id, rating, text,
      booking: bookingId || undefined, approved: false
    });
    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Review.find().populate('user', 'name email').sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Review.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
