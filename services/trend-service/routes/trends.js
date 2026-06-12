const express = require('express');
const router = express.Router();
const TrendData = require('../models/TrendData');
const { fetchAndSaveTrends } = require('../services/etsyService');
const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'aceh_export_secret_key_2024'); } catch {}
  }
  next();
};

// Public: semua tren (untuk dashboard utama)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const filter = category ? { category } : {};
    const trends = await TrendData.find(filter).sort({ trendScore: -1 }).limit(Number(limit));
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Public: top trending
router.get('/public/top', async (req, res) => {
  try {
    const trends = await TrendData.find().sort({ trendScore: -1 }).limit(10);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: tren per kategori
router.get('/public/by-category', async (req, res) => {
  try {
    const result = await TrendData.aggregate([
      { $group: { _id: '$category', avgScore: { $avg: '$trendScore' }, totalVolume: { $sum: '$searchVolume' }, count: { $sum: 1 } } },
      { $sort: { avgScore: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: negara potensial
router.get('/public/countries', async (req, res) => {
  try {
    const trends = await TrendData.find({}, 'topCountries trendScore category');
    const countryMap = {};

    for (const trend of trends) {
      for (const c of trend.topCountries) {
        if (!countryMap[c.country]) countryMap[c.country] = { country: c.country, totalScore: 0, categories: [], count: 0 };
        countryMap[c.country].totalScore += trend.trendScore * (c.percentage / 100);
        countryMap[c.country].count += 1;
        if (!countryMap[c.country].categories.includes(trend.category)) {
          countryMap[c.country].categories.push(trend.category);
        }
      }
    }

    const countries = Object.values(countryMap)
      .map(c => ({ ...c, avgScore: Math.round(c.totalScore / c.count) }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 15);

    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin/internal: refresh tren dari Etsy
router.post('/refresh', async (req, res) => {
  try {
    const results = await fetchAndSaveTrends();
    res.json({ message: 'Data tren diperbarui', count: results.length });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui tren', error: err.message });
  }
});

// Tren berdasarkan kategori tertentu
router.get('/category/:category', async (req, res) => {
  try {
    const trends = await TrendData.find({ category: req.params.category }).sort({ trendScore: -1 });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
