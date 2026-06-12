const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, adminOnly } = require('../middleware/auth');

// Get all users (admin)
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User stats
router.get('/stats/users', authenticate, adminOnly, async (req, res) => {
  try {
    const total = await User.countDocuments();
    const umkm = await User.countDocuments({ role: 'umkm' });
    const exporter = await User.countDocuments({ role: 'exporter' });
    const admin = await User.countDocuments({ role: 'admin' });
    res.json({ total, umkm, exporter, admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
