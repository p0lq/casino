const router = require('express').Router();
const Table = require('../models/Table');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadTable } = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const tables = await Table.find({ available: true }).sort({ number: 1 });
    const { date, time } = req.query;
    if (!date || !time) return res.json(tables.map(t => ({ ...t.toObject(), isBooked: false })));

    const bookings = await Booking.find({ date, status: { $in: ['pending', 'confirmed'] } });
    const reqHour = parseInt(time.split(':')[0]);
    const bookedIds = new Set(
      bookings
        .filter(b => Math.abs(parseInt(b.time.split(':')[0]) - reqHour) < (b.duration || 2))
        .map(b => b.table.toString())
    );
    res.json(tables.map(t => ({ ...t.toObject(), isBooked: bookedIds.has(t._id.toString()) })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Table.find().sort({ number: 1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, adminOnly, uploadTable.single('image'), async (req, res) => {
  try {
    const { number, seats, desc_ru, desc_kz, desc_en } = req.body;
    const table = await Table.create({
      number: parseInt(number),
      seats:  parseInt(seats),
      description: { ru: desc_ru, kz: desc_kz, en: desc_en },
      image: req.file ? req.file.path : ''
    });
    res.status(201).json(table);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, uploadTable.single('image'), async (req, res) => {
  try {
    const { number, seats, desc_ru, desc_kz, desc_en, available } = req.body;
    const update = {
      number: parseInt(number), seats: parseInt(seats),
      description: { ru: desc_ru, kz: desc_kz, en: desc_en },
      available: available === 'true'
    };
    if (req.file) update.image = req.file.path;
    res.json(await Table.findByIdAndUpdate(req.params.id, update, { new: true }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
