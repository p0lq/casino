const router = require('express').Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadPayment } = require('../middleware/upload');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/verify/:bookingId', protect, uploadPayment.single('screenshot'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });
    if (!req.file) return res.status(400).json({ message: 'No screenshot uploaded' });

    booking.payment.screenshotUrl      = req.file.path;
    booking.payment.screenshotPublicId = req.file.filename;
    booking.payment.status             = 'verifying';
    await booking.save();

    try {
      const msg = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: req.file.path } },
            {
              type: 'text',
              text: `Analyze this Kaspi payment screenshot.
Check:
1. Is this a successful Kaspi payment? (look for "Успешно", "Оплачено", green checkmark, receipt)
2. Payment amount in KZT?
3. Recipient name visible?

Required: amount >= ${booking.totalAmount} KZT, recipient: ${process.env.KASPI_RECIPIENT_NAME || 'COFFESINO'}

Reply ONLY as JSON (no markdown):
{"valid":true/false,"amount":number_or_null,"recipient":"string_or_null","confidence":"high/medium/low","reason":"brief"}`
            }
          ]
        }]
      });

      let ai;
      try { ai = JSON.parse(msg.content[0].text); }
      catch { ai = { valid: false, reason: 'Parse error', raw: msg.content[0].text }; }

      booking.payment.aiResult = ai;

      if (ai.valid && (ai.amount === null || ai.amount >= booking.totalAmount * 0.95)) {
        booking.payment.status    = 'confirmed';
        booking.payment.verifiedBy = 'ai';
        booking.payment.verifiedAt = new Date();
        booking.status             = 'confirmed';
      } else {
        booking.payment.status = 'failed';
      }
      await booking.save();

      res.json({
        status:        booking.payment.status,
        aiResult:      ai,
        wheelEligible: booking.payment.status === 'confirmed' && booking.totalAmount >= 2500 && !booking.wheelSpun,
        bookingId:     booking._id,
        totalAmount:   booking.totalAmount
      });

    } catch (aiErr) {
      console.error('AI error:', aiErr.message);
      booking.payment.status = 'uploaded';
      await booking.save();
      res.json({ status: 'uploaded', message: 'Screenshot saved. Admin will verify shortly.', bookingId: booking._id });
    }

  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/admin/confirm/:bookingId', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    const { action } = req.body;
    if (action === 'confirm') {
      booking.payment.status     = 'confirmed';
      booking.payment.verifiedBy = 'admin';
      booking.payment.verifiedAt = new Date();
      booking.status             = 'confirmed';
    } else {
      booking.payment.status = 'failed';
    }
    await booking.save();
    res.json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
