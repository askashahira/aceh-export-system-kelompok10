require('dotenv').config({ path: '../../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const { fetchAndSaveTrends } = require('./services/etsyService');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://localhost:27017/aceh_export_db'
  )
  .then(async () => {
    console.log('✅ Trend Service: MongoDB terhubung');

    console.log('📊 Sinkronisasi data tren...');
    await fetchAndSaveTrends();
  })
  .catch(err => {
    console.log(
      '⚠️ Trend Service: MongoDB error -',
      err.message
    );
  });

app.use(
  '/api/trends',
  require('./routes/trends')
);

app.get('/health', (req, res) => {
  res.json({
    service: 'trend-service',
    status: 'ok'
  });
});

// Update setiap 6 jam
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log(
      '🔄 Memperbarui data tren dari Etsy...'
    );

    await fetchAndSaveTrends();

    console.log(
      '✅ Data tren berhasil diperbarui'
    );
  } catch (err) {
    console.error(
      '❌ Gagal update tren:',
      err.message
    );
  }
});

const PORT =
  process.env.TREND_SERVICE_PORT || 3003;

app.listen(PORT, () => {
  console.log(
    `✅ Trend Service berjalan di port ${PORT}`
  );
});