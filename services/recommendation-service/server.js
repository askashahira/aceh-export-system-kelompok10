require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aceh_export_db')
  .then(() => console.log('✅ Recommendation Service: MongoDB terhubung'))
  .catch(err => console.log('⚠️ Recommendation Service: MongoDB error -', err.message));

app.use('/api/recommendations', require('./routes/recommendations'));
app.get('/health', (req, res) => res.json({ service: 'recommendation-service', status: 'ok' }));

const PORT = process.env.RECOMMENDATION_SERVICE_PORT || 3004;
app.listen(PORT, () => console.log(`✅ Recommendation Service berjalan di port ${PORT}`));
