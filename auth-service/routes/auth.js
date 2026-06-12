const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessCategory, address, phone, whatsapp, description, companyName, country } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const user = new User({ name, email, password, role: role || 'umkm', businessName, businessCategory, address, phone, whatsapp, description, companyName, country });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'aceh_export_secret_key_2024', { expiresIn: '7d' });
    res.status(201).json({ message: 'Registrasi berhasil', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email atau password salah' });
    if (!user.isActive) return res.status(403).json({ message: 'Akun tidak aktif' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'aceh_export_secret_key_2024', { expiresIn: '7d' });
    res.json({ message: 'Login berhasil', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, companyName: user.companyName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; delete updates.role; delete updates.email;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profil diperbarui', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
