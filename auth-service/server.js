require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aceh_export_db')
  .then(() => console.log('✅ Auth Service: MongoDB terhubung'))
  .catch(err => console.log('⚠️ Auth Service: MongoDB error -', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/health', (req, res) => res.json({ service: 'auth-service', status: 'ok' }));

const PORT = process.env.AUTH_SERVICE_PORT || 3001;
app.listen(PORT, () => console.log(`✅ Auth Service berjalan di port ${PORT}`));
