const express = require('express');
const router = express.Router();
const ExportInterest = require('../models/ExportInterest');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// Public: submit export interest (eksportir ajukan minat)
router.post('/', async (req, res) => {
  try {
    const { productId, exporterName, exporterEmail, companyName, country, quantity, unit, notes } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const interest = new ExportInterest({
      productId, umkmId: product.umkmId,
      exporterName, exporterEmail, companyName, country, quantity, unit, notes
    });
    await interest.save();
    res.status(201).json({ message: 'Minat ekspor berhasil dikirim! UMKM akan menghubungi Anda.', interest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UMKM: lihat permintaan untuk produk saya
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const interests = await ExportInterest.find({ umkmId: req.user.id })
      .populate('productId', 'name category price')
      .sort({ createdAt: -1 });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UMKM: update status permintaan
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const interest = await ExportInterest.findById(req.params.id);
    if (!interest) return res.status(404).json({ message: 'Tidak ditemukan' });
    if (interest.umkmId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak berhak' });
    }
    interest.status = status;
    await interest.save();
    res.json({ message: 'Status diperbarui', interest });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
