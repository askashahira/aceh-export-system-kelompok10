import React, { useEffect, useState } from 'react';
import { trendAPI, recommendAPI } from '../../services/api';
import { ScoreBadge } from '../../components/ui/TrendChart';

const CAT_LABELS = { kopi:'☕ Kopi', madu:'🍯 Madu', kerajinan:'🧶 Kerajinan', fesyen_muslim:'👗 Fesyen Muslim', makanan:'🍱 Makanan', rempah:'🌶️ Rempah', lainnya:'📦 Lainnya' };

export default function CountryData() {
  const [countries, setCountries] = useState([]);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      trendAPI.getCountries(),
      recommendAPI.overview()
    ]).then(([cRes, oRes]) => {
      setCountries(cRes.data);
      setOverview(oRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">Memuat data negara...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data Negara Potensial</h1>
        <p className="text-gray-500 text-sm">Negara dengan permintaan tertinggi berdasarkan tren marketplace global</p>
      </div>

      {/* Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((c, i) => (
          <div key={c.country} className="card hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-200 leading-none">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{c.country}</h3>
                  <p className="text-xs text-gray-400">{c.count} produk relevan</p>
                </div>
              </div>
              <ScoreBadge score={c.avgScore} />
            </div>

            <div className="mb-3">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${c.avgScore}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Skor: {c.avgScore}/100</span>
              </div>
            </div>

            {c.categories?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Kategori diminati:</p>
                <div className="flex flex-wrap gap-1">
                  {c.categories.slice(0, 4).map(cat => (
                    <span key={cat} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {CAT_LABELS[cat] || cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Overview Table */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">📊 Peluang per Kategori Produk Aceh</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Kategori</th>
                <th className="text-left py-2 text-gray-500 font-medium">Skor Rata-rata</th>
                <th className="text-left py-2 text-gray-500 font-medium">Level</th>
                <th className="text-left py-2 text-gray-500 font-medium">Negara Teratas</th>
                <th className="text-left py-2 text-gray-500 font-medium">Strategi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {overview.map(o => (
                <tr key={o.category} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{CAT_LABELS[o.category] || o.category}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${o.avgScore}%` }} />
                      </div>
                      <span className="font-bold text-blue-900">{o.avgScore}</span>
                    </div>
                  </td>
                  <td className="py-3"><ScoreBadge score={o.avgScore} /></td>
                  <td className="py-3 text-gray-600">{o.topCountry || '—'}</td>
                  <td className="py-3 text-gray-500 text-xs max-w-[180px] truncate">{o.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
        <h2 className="font-semibold text-blue-900 mb-3">💡 Tips Ekspor untuk Eksportir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Hubungi UMKM langsung melalui kontak di halaman produk untuk negosiasi harga.',
            'Perhatikan sertifikasi produk (Halal, Organik) yang dibutuhkan negara tujuan.',
            'Gunakan fitur "Ajukan Minat" agar UMKM menerima notifikasi permintaan Anda.',
            'Produk dengan skor tren tinggi memiliki permintaan aktual di marketplace global.'
          ].map((tip, i) => (
            <div key={i} className="flex gap-2 text-sm text-blue-800">
              <span className="text-cyan-500 font-bold shrink-0">→</span>{tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
