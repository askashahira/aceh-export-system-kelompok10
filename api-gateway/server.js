require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const TREND_URL = process.env.TREND_SERVICE_URL || 'http://localhost:3003';
const RECOMMENDATION_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3004';
const JWT_SECRET = process.env.JWT_SECRET || 'aceh_export_secret_key_2024';

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token diperlukan' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });
  next();
};

// Clean proxy — hanya kirim body & authorization, buang headers browser yang ganggu
async function proxy(req, res, targetBase) {
  try {
    const url = `${targetBase}${req.path}`;

    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) headers['authorization'] = req.headers.authorization;

    const config = {
      method: req.method,
      url,
      headers,
      params: req.query,
      timeout: 30000
    };

    // Hanya kirim body untuk POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      config.data = req.body;
    }

    const response = await axios(config);
    return res.status(response.status).json(response.data);

  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    console.error(`Proxy error [${req.method} ${req.path}]:`, err.message);
    return res.status(503).json({ message: 'Service tidak tersedia', error: err.message });
  }
}

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'API Gateway aktif',
  services: { auth: AUTH_URL, product: PRODUCT_URL, trend: TREND_URL, recommendation: RECOMMENDATION_URL }
}));

// ── AUTH (public) ─────────────────────────────────────────────────────────────
app.all('/api/auth/*', (req, res) => proxy(req, res, AUTH_URL));

// ── TRENDS public ─────────────────────────────────────────────────────────────
app.all('/api/trends/public/*', (req, res) => proxy(req, res, TREND_URL));

// ── RECOMMENDATIONS public ────────────────────────────────────────────────────
app.all('/api/recommendations/public/*', (req, res) => proxy(req, res, RECOMMENDATION_URL));
app.post('/api/recommendations/for-product', (req, res) => proxy(req, res, RECOMMENDATION_URL));

// ── PRODUCTS (protected) ──────────────────────────────────────────────────────
app.all('/api/products*', authenticate, (req, res) => proxy(req, res, PRODUCT_URL));
app.all('/api/export-interests*', authenticate, (req, res) => proxy(req, res, PRODUCT_URL));

// ── TRENDS (protected) ────────────────────────────────────────────────────────
app.all('/api/trends*', authenticate, (req, res) => proxy(req, res, TREND_URL));

// ── RECOMMENDATIONS (protected) ───────────────────────────────────────────────
app.all('/api/recommendations*', authenticate, (req, res) => proxy(req, res, RECOMMENDATION_URL));

// ── ADMIN ─────────────────────────────────────────────────────────────────────
app.all('/api/admin/users*', authenticate, adminOnly, (req, res) => proxy(req, res, AUTH_URL));
app.all('/api/admin/stats/users*', authenticate, adminOnly, (req, res) => proxy(req, res, AUTH_URL));
app.all('/api/admin*', authenticate, adminOnly, (req, res) => proxy(req, res, PRODUCT_URL));

const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API Gateway berjalan di port ${PORT}`));
