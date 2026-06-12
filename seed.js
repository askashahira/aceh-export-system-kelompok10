/**
 * Seed script — buat akun demo & produk contoh
 * Jalankan: node seed.js
 */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aceh_export_db';

// ── Schemas (inline) ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['umkm', 'exporter', 'admin'], default: 'umkm' },
  businessName: String, businessCategory: String, phone: String, whatsapp: String,
  companyName: String, country: String, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  umkmId: String, umkmName: String,
  umkmContact: { phone: String, whatsapp: String, email: String },
  name: String, category: String, price: Number, unit: String, minOrder: Number,
  description: String, tags: [String], recommendedCountries: [{ country: String, trendScore: Number }],
  isActive: { type: Boolean, default: true }, viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// ── Seed data ─────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB terhubung');

  // Hapus data lama
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Data lama dihapus');

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Akun demo
  const users = await User.insertMany([
    { name: 'Admin Dinas', email: 'admin@aceh.id', password: hash('admin123'), role: 'admin', businessName: 'Dinas Perdagangan Aceh' },
    { name: 'Siti Aminah', email: 'umkm@aceh.id', password: hash('umkm123'), role: 'umkm', businessName: 'Kopi Gayo Berkah', businessCategory: 'kopi', phone: '081234567890', whatsapp: '6281234567890' },
    { name: 'Zainuddin', email: 'umkm2@aceh.id', password: hash('umkm123'), role: 'umkm', businessName: 'Madu Hutan Aceh', businessCategory: 'madu', phone: '082345678901', whatsapp: '6282345678901' },
    { name: 'Fatimah Zahra', email: 'umkm3@aceh.id', password: hash('umkm123'), role: 'umkm', businessName: 'Kerajinan Songket Aceh', businessCategory: 'kerajinan', phone: '083456789012', whatsapp: '6283456789012' },
    { name: 'Ahmad Rasyid', email: 'umkm4@aceh.id', password: hash('umkm123'), role: 'umkm', businessName: 'Rempah Nusantara Aceh', businessCategory: 'rempah', phone: '084567890123', whatsapp: '6284567890123' },
    { name: 'Kenji Tanaka', email: 'eksportir@aceh.id', password: hash('eksportir123'), role: 'exporter', companyName: 'Tanaka Trading Co.', country: 'Jepang' },
    { name: 'Ahmad Al-Rashid', email: 'eksportir2@aceh.id', password: hash('eksportir123'), role: 'exporter', companyName: 'Al-Rashid Import LLC', country: 'Malaysia' }
  ]);
  console.log(`👤 ${users.length} akun demo dibuat`);

  // Cari UMKM users
  const umkm1 = users.find(u => u.email === 'umkm@aceh.id');
  const umkm2 = users.find(u => u.email === 'umkm2@aceh.id');
  const umkm3 = users.find(u => u.email === 'umkm3@aceh.id');
  const umkm4 = users.find(u => u.email === 'umkm4@aceh.id');

  // Produk contoh
  await Product.insertMany([
    {
      umkmId: umkm1._id.toString(), umkmName: umkm1.businessName,
      umkmContact: { phone: '081234567890', whatsapp: '6281234567890', email: 'umkm@aceh.id' },
      name: 'Kopi Arabika Gayo Single Origin', category: 'kopi',
      price: 180000, unit: 'kg', minOrder: 10,
      description: 'Kopi arabika premium dari dataran tinggi Gayo, Aceh Tengah. Diproses dengan metode washed process untuk menghasilkan cita rasa yang bersih dengan keasaman seimbang.',
      tags: ['organik', 'premium', 'halal', 'specialty coffee'],
      recommendedCountries: [{ country: 'Jepang', trendScore: 94 }, { country: 'Amerika Serikat', trendScore: 88 }, { country: 'Korea Selatan', trendScore: 85 }]
    },
    {
      umkmId: umkm1._id.toString(), umkmName: umkm1.businessName,
      umkmContact: { phone: '081234567890', whatsapp: '6281234567890', email: 'umkm@aceh.id' },
      name: 'Kopi Gayo Natural Process', category: 'kopi',
      price: 220000, unit: 'kg', minOrder: 5,
      description: 'Kopi Gayo dengan proses natural, menghasilkan cita rasa fruity dan body yang lebih penuh. Cocok untuk espresso specialty.',
      tags: ['natural process', 'specialty', 'halal'],
      recommendedCountries: [{ country: 'Jerman', trendScore: 90 }, { country: 'Belanda', trendScore: 87 }, { country: 'Inggris', trendScore: 83 }]
    },
    {
      umkmId: umkm2._id.toString(), umkmName: umkm2.businessName,
      umkmContact: { phone: '082345678901', whatsapp: '6282345678901', email: 'umkm2@aceh.id' },
      name: 'Madu Hutan Liar Aceh Premium', category: 'madu',
      price: 350000, unit: 'liter', minOrder: 5,
      description: 'Madu hutan murni yang dipanen dari lebah liar di hutan Leuser, Aceh. Kandungan antioksidan tinggi, tidak dipanaskan (raw honey).',
      tags: ['raw honey', 'organik', 'halal', 'wild forest'],
      recommendedCountries: [{ country: 'Malaysia', trendScore: 87 }, { country: 'Arab Saudi', trendScore: 82 }, { country: 'Uni Emirat Arab', trendScore: 78 }]
    },
    {
      umkmId: umkm2._id.toString(), umkmName: umkm2.businessName,
      umkmContact: { phone: '082345678901', whatsapp: '6282345678901', email: 'umkm2@aceh.id' },
      name: 'Madu Tualang Aceh', category: 'madu',
      price: 420000, unit: 'liter', minOrder: 3,
      description: 'Madu tualang langka dari pohon tualang raksasa di hutan Aceh. Dipercaya memiliki manfaat kesehatan luar biasa.',
      tags: ['tualang', 'premium', 'halal', 'langka'],
      recommendedCountries: [{ country: 'Jepang', trendScore: 83 }, { country: 'Australia', trendScore: 79 }, { country: 'Amerika Serikat', trendScore: 75 }]
    },
    {
      umkmId: umkm3._id.toString(), umkmName: umkm3.businessName,
      umkmContact: { phone: '083456789012', whatsapp: '6283456789012', email: 'umkm3@aceh.id' },
      name: 'Songket Aceh Motif Pintu Aceh', category: 'kerajinan',
      price: 850000, unit: 'pcs', minOrder: 1,
      description: 'Kain songket tradisional Aceh dengan motif khas Pintu Aceh, ditenun tangan menggunakan benang emas asli. Setiap lembar membutuhkan 2-3 minggu pengerjaan.',
      tags: ['tenun tangan', 'budaya', 'premium', 'tradisional'],
      recommendedCountries: [{ country: 'Malaysia', trendScore: 88 }, { country: 'Brunei', trendScore: 82 }, { country: 'Singapura', trendScore: 78 }]
    },
    {
      umkmId: umkm3._id.toString(), umkmName: umkm3.businessName,
      umkmContact: { phone: '083456789012', whatsapp: '6283456789012', email: 'umkm3@aceh.id' },
      name: 'Keranjang Rotan Acehnese Handmade', category: 'kerajinan',
      price: 250000, unit: 'pcs', minOrder: 10,
      description: 'Keranjang rotan anyaman tangan khas Aceh. Cocok sebagai dekorasi rumah atau fungsional. Tersedia berbagai ukuran.',
      tags: ['rotan', 'anyaman', 'handmade', 'eco-friendly'],
      recommendedCountries: [{ country: 'Australia', trendScore: 81 }, { country: 'Belanda', trendScore: 78 }, { country: 'Turki', trendScore: 74 }]
    },
    {
      umkmId: umkm4._id.toString(), umkmName: umkm4.businessName,
      umkmContact: { phone: '084567890123', whatsapp: '6284567890123', email: 'umkm4@aceh.id' },
      name: 'Rempah Kari Aceh Original', category: 'rempah',
      price: 85000, unit: 'kg', minOrder: 20,
      description: 'Bumbu rempah kari khas Aceh dengan perpaduan 12 rempah pilihan. Formula turun-temurun dari Aceh Besar.',
      tags: ['rempah', 'halal', 'organik', 'original'],
      recommendedCountries: [{ country: 'Jerman', trendScore: 82 }, { country: 'Belanda', trendScore: 79 }, { country: 'Amerika Serikat', trendScore: 76 }]
    },
    {
      umkmId: umkm4._id.toString(), umkmName: umkm4.businessName,
      umkmContact: { phone: '084567890123', whatsapp: '6284567890123', email: 'umkm4@aceh.id' },
      name: 'Lada Hitam Aceh Organik', category: 'rempah',
      price: 120000, unit: 'kg', minOrder: 15,
      description: 'Lada hitam organik dari Aceh Selatan dengan aroma kuat dan rasa pedas yang khas. Tersertifikasi organik.',
      tags: ['lada hitam', 'organik', 'halal', 'sertifikasi'],
      recommendedCountries: [{ country: 'Amerika Serikat', trendScore: 79 }, { country: 'Inggris', trendScore: 76 }, { country: 'Jerman', trendScore: 73 }]
    }
  ]);
  console.log('📦 8 produk contoh dibuat');

  console.log('\n✅ SEED SELESAI!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Akun Demo:');
  console.log('  Admin     → admin@aceh.id      / admin123');
  console.log('  UMKM      → umkm@aceh.id       / umkm123');
  console.log('  UMKM 2    → umkm2@aceh.id      / umkm123');
  console.log('  Eksportir → eksportir@aceh.id  / eksportir123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
