require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aceh_export_db')
  .then(() => console.log('✅ Product Service: MongoDB terhubung'))
  .catch(err => console.log('⚠️ Product Service: MongoDB error -', err.message));

app.use('/api/products', require('./routes/products'));
app.use('/api/export-interests', require('./routes/exportInterests'));
app.use('/api/admin', require('./routes/adminProducts'));

app.get('/health', (req, res) => res.json({ service: 'product-service', status: 'ok' }));

const PORT = process.env.PRODUCT_SERVICE_PORT || 3002;
app.listen(PORT, () => console.log(`✅ Product Service berjalan di port ${PORT}`));
