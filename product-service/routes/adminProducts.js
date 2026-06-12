const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ExportInterest = require('../models/ExportInterest');
const { authenticate, adminOnly } = require('../middleware/auth');

// Admin: semua produk
router.get('/products', authenticate, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const products = await Product.find().skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Product.countDocuments();
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: semua export interests
router.get('/interests', authenticate, adminOnly, async (req, res) => {
  try {
    const interests = await ExportInterest.find().populate('productId', 'name category').sort({ createdAt: -1 });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: statistik
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalInterests = await ExportInterest.countDocuments();
    const pendingInterests = await ExportInterest.countDocuments({ status: 'pending' });

    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byCountry = await ExportInterest.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 }
    ]);

    res.json({ totalProducts, activeProducts, totalInterests, pendingInterests, byCategory, byCountry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
