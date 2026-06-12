const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  umkmId: { type: String, required: true },
  umkmName: { type: String, required: true },
  umkmContact: {
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String }
  },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['kopi', 'madu', 'kerajinan', 'fesyen_muslim', 'makanan', 'rempah', 'lainnya'],
    required: true
  },
  price: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  minOrder: { type: Number, default: 1 },
  description: { type: String },
  images: [{ type: String }],
  tags: [{ type: String }],
  recommendedCountries: [{ country: String, trendScore: Number }],
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', productSchema);
