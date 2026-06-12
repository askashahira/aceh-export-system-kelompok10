const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token diperlukan' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'aceh_export_secret_key_2024');
    next();
  } catch {
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Akses admin diperlukan' });
  next();
};

module.exports = { authenticate, adminOnly };
