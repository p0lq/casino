const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadMenuItem } = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const filter = { available: true };
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    res.json(await MenuItem.find(filter).sort({ category: 1, createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try { res.json(await MenuItem.find().sort({ category: 1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, adminOnly, uploadMenuItem.single('image'), async (req, res) => {
  try {
    const { name_ru, name_kz, name_en, desc_ru, desc_kz, desc_en, category, price } = req.body;
    const item = await MenuItem.create({
      name:        { ru: name_ru, kz: name_kz, en: name_en },
      description: { ru: desc_ru, kz: desc_kz, en: desc_en },
      category,
      price:  parseFloat(price),
      image:  req.file ? req.file.path : ''
    });
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, uploadMenuItem.single('image'), async (req, res) => {
  try {
    const { name_ru, name_kz, name_en, desc_ru, desc_kz, desc_en, category, price, available } = req.body;
    const update = {
      name:        { ru: name_ru, kz: name_kz, en: name_en },
      description: { ru: desc_ru, kz: desc_kz, en: desc_en },
      category,
      price:     parseFloat(price),
      available: available === 'true'
    };
    if (req.file) update.image = req.file.path;
    res.json(await MenuItem.findByIdAndUpdate(req.params.id, update, { new: true }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
