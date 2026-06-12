const mongoose = require('mongoose');

const exportInterestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  umkmId: { type: String, required: true },
  exporterName: { type: String, required: true },
  exporterEmail: { type: String },
  companyName: { type: String },
  country: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'contacted', 'closed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExportInterest', exportInterestSchema);
