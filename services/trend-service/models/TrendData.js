const mongoose = require('mongoose');

const trendDataSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  category: {
    type: String,
    enum: ['kopi', 'madu', 'kerajinan', 'fesyen_muslim', 'makanan', 'rempah', 'lainnya'],
    required: true
  },
  trendScore: { type: Number, default: 0 },   // 0–100
  searchVolume: { type: Number, default: 0 },
  source: { type: String, default: 'etsy' },   // etsy | mock
  topCountries: [{ country: String, percentage: Number }],
  priceRange: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrendData', trendDataSchema);
