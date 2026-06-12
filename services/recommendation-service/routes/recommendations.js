const express = require('express');
const router = express.Router();
const axios = require('axios');

const TREND_URL = process.env.TREND_SERVICE_URL || 'http://localhost:3003';

// Strategi pemasaran per kategori
const STRATEGIES = {
  kopi: {
    tips: ['Gunakan kemasan premium dengan cerita asal-usul Gayo', 'Sertifikasi halal & organik meningkatkan nilai jual 30%', 'Targetkan coffee shop specialty & roastery premium', 'Promosikan melalui platform specialty coffee seperti Atlas Coffee'],
    platforms: ['Etsy', 'Amazon', 'Specialty Coffee Marketplace'],
    certification: ['Halal', 'Organik', 'Fair Trade', 'Rainforest Alliance']
  },
  madu: {
    tips: ['Tonjolkan keunikan madu hutan liar (wild forest honey)', 'Kemasan kaca premium lebih diminati pasar Timur Tengah', 'Lab-test keaslian madu meningkatkan kepercayaan pembeli', 'Manfaatkan tren wellness & natural healing'],
    platforms: ['Etsy', 'Amazon Handmade', 'iHerb'],
    certification: ['Halal', 'BPOM', 'Lab Certificate']
  },
  kerajinan: {
    tips: ['Tampilkan proses pembuatan tangan di media sosial', 'Ceritakan nilai budaya Aceh di setiap produk', 'Kemasan eco-friendly diminati pasar Eropa & Australia', 'Ikuti pameran crafts internasional virtual'],
    platforms: ['Etsy', 'Not on the High Street', 'Amazon Handmade'],
    certification: ['Craft Council', 'ASEAN Handicraft']
  },
  fesyen_muslim: {
    tips: ['Kolaborasi dengan modest fashion influencer global', 'Tampilkan model diverse untuk pasar internasional', 'Ukuran S–XXL wajib tersedia untuk pasar Eropa', 'Manfaatkan momen Ramadan & Idul Fitri untuk promosi besar'],
    platforms: ['Etsy', 'Modanisa', 'Namshi', 'Zalora'],
    certification: ['Halal Textile', 'SNI']
  },
  makanan: {
    tips: ['Pastikan sertifikasi BPOM & halal sebelum ekspor', 'Shelf-life & packaging vakum penting untuk ekspor', 'Targetkan diaspora Indonesia di luar negeri sebagai pasar awal', 'Ceritakan keunikan rasa Aceh di label produk'],
    platforms: ['Tokopedia Global', 'Shopee International', 'Amazon'],
    certification: ['BPOM', 'Halal MUI', 'Karantina']
  },
  rempah: {
    tips: ['Pasar Eropa sangat tertarik rempah organik', 'Kemasan resealable 50–200g paling banyak dibeli', 'Tawarkan paket bundle rempah khas Aceh', 'Edukasi penggunaan rempah di konten marketing'],
    platforms: ['Etsy', 'Amazon', 'Spice specialty stores'],
    certification: ['Organik', 'Halal', 'BPOM', 'Phytosanitary']
  },
  lainnya: {
    tips: ['Riset pasar lokal terlebih dahulu sebelum ekspor', 'Mulai dari marketplace regional ASEAN', 'Bangun brand identity yang kuat'],
    platforms: ['Shopee International', 'Lazada', 'Tokopedia Global'],
    certification: ['Halal', 'SNI']
  }
};

// Public: rekomendasi berdasarkan kategori
router.get('/public/by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const trendRes = await axios.get(`${TREND_URL}/api/trends/category/${category}`).catch(() => ({ data: [] }));
    const trends = trendRes.data;

    const countryScores = {};
    for (const trend of trends) {
      for (const c of (trend.topCountries || [])) {
        if (!countryScores[c.country]) countryScores[c.country] = { country: c.country, score: 0, count: 0 };
        countryScores[c.country].score += trend.trendScore * (c.percentage / 100);
        countryScores[c.country].count += 1;
      }
    }

    const recommendations = Object.values(countryScores)
      .map(c => ({ country: c.country, trendScore: Math.round(c.score / (c.count || 1)), level: scoreToLevel(c.score / (c.count || 1)) }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 8);

    const strategy = STRATEGIES[category] || STRATEGIES.lainnya;

    res.json({ category, recommendations, strategy, trends: trends.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Public: rekomendasi lengkap semua kategori
router.get('/public/overview', async (req, res) => {
  try {
    const trendRes = await axios.get(`${TREND_URL}/api/trends`).catch(() => ({ data: [] }));
    const trends = trendRes.data;

    const byCategory = {};
    for (const trend of trends) {
      if (!byCategory[trend.category]) byCategory[trend.category] = { category: trend.category, avgScore: 0, count: 0, topCountry: null };
      byCategory[trend.category].avgScore += trend.trendScore;
      byCategory[trend.category].count += 1;
      if (trend.topCountries?.[0] && !byCategory[trend.category].topCountry) {
        byCategory[trend.category].topCountry = trend.topCountries[0].country;
      }
    }

    const overview = Object.values(byCategory).map(c => ({
      ...c,
      avgScore: Math.round(c.avgScore / (c.count || 1)),
      level: scoreToLevel(c.avgScore / (c.count || 1)),
      strategy: (STRATEGIES[c.category] || STRATEGIES.lainnya).tips[0]
    })).sort((a, b) => b.avgScore - a.avgScore);

    res.json(overview);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Rekomendasi untuk produk spesifik berdasarkan nama & kategori
router.post('/for-product', async (req, res) => {
  try {
    const { category, productName } = req.body;
    const trendRes = await axios.get(`${TREND_URL}/api/trends/category/${category}`).catch(() => ({ data: [] }));
    const trends = trendRes.data;

    const countryScores = {};
    for (const trend of trends) {
      for (const c of (trend.topCountries || [])) {
        if (!countryScores[c.country]) countryScores[c.country] = { country: c.country, score: 0, count: 0 };
        countryScores[c.country].score += trend.trendScore * (c.percentage / 100);
        countryScores[c.country].count += 1;
      }
    }

    const recommendations = Object.values(countryScores)
      .map(c => ({ country: c.country, trendScore: Math.round(c.score / (c.count || 1)), level: scoreToLevel(c.score / (c.count || 1)) }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 5);

    const strategy = STRATEGIES[category] || STRATEGIES.lainnya;

    res.json({ productName, category, recommendations, strategy });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

function scoreToLevel(score) {
  if (score >= 85) return 'Sangat Tinggi';
  if (score >= 70) return 'Tinggi';
  if (score >= 50) return 'Sedang';
  return 'Rendah';
}

module.exports = router;
