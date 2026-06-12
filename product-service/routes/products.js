const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// Public: get all products (for exporter/public view)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const products = await Product.find(filter).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Public: get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    product.viewCount += 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UMKM: get my products
router.get('/my/products', authenticate, async (req, res) => {
  try {
    const products = await Product.find({ umkmId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UMKM: create product
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'umkm' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Hanya UMKM yang bisa menambah produk' });
    }
    const { name, category, price, unit, minOrder, description, tags, umkmContact } = req.body;
    const product = new Product({
      umkmId: req.user.id,
      umkmName: req.user.name,
      umkmContact,
      name, category, price, unit, minOrder, description,
      tags: tags || [],
      recommendedCountries: getDefaultRecommendations(category)
    });
    await product.save();
    res.status(201).json({ message: 'Produk berhasil ditambahkan', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UMKM: update product
router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    if (product.umkmId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak berhak mengubah produk ini' });
    }
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates.umkmId; delete updates.umkmName;
    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: 'Produk diperbarui', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UMKM: delete product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    if (product.umkmId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak berhak menghapus produk ini' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

function getDefaultRecommendations(category) {
  const map = {
    kopi: [{ country: 'Jepang', trendScore: 92 }, { country: 'Amerika Serikat', trendScore: 88 }, { country: 'Korea Selatan', trendScore: 85 }],
    madu: [{ country: 'Malaysia', trendScore: 87 }, { country: 'Arab Saudi', trendScore: 82 }, { country: 'Uni Emirat Arab', trendScore: 78 }],
    kerajinan: [{ country: 'Australia', trendScore: 84 }, { country: 'Belanda', trendScore: 80 }, { country: 'Turki', trendScore: 75 }],
    fesyen_muslim: [{ country: 'Malaysia', trendScore: 93 }, { country: 'Turki', trendScore: 89 }, { country: 'Arab Saudi', trendScore: 85 }],
    makanan: [{ country: 'Singapura', trendScore: 88 }, { country: 'Malaysia', trendScore: 85 }, { country: 'Brunei', trendScore: 80 }],
    rempah: [{ country: 'Jerman', trendScore: 86 }, { country: 'Belanda', trendScore: 83 }, { country: 'Amerika Serikat', trendScore: 79 }],
    lainnya: [{ country: 'Singapura', trendScore: 75 }, { country: 'Malaysia', trendScore: 73 }, { country: 'Australia', trendScore: 70 }]
  };
  return map[category] || map.lainnya;
}

module.exports = router;
