import React, { useEffect, useState } from 'react';
import { recommendAPI, trendAPI } from '../../services/api';
import { TrendBarChart, ScoreBadge } from '../../components/ui/TrendChart';

const CATEGORIES = ['kopi', 'madu', 'kerajinan', 'fesyen_muslim', 'makanan', 'rempah'];
const CAT_LABELS = { kopi:'☕ Kopi', madu:'🍯 Madu', kerajinan:'🧶 Kerajinan', fesyen_muslim:'👗 Fesyen Muslim', makanan:'🍱 Makanan', rempah:'🌶️ Rempah' };

export default function UMKMRecommendations() {
  const [selectedCat, setSelectedCat] = useState('kopi');
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    recommendAPI.overview().then(r => setOverview(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    recommendAPI.byCategory(selectedCat).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [selectedCat]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Rekomendasi Pasar Ekspor</h1>
        <p className="text-gray-500 text-sm">Berdasarkan analisis tren marketplace global terkini</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {overview.map(o => (
          <div key={o.category} onClick={() => setSelectedCat(o.category)}
            className={`card cursor-pointer transition-all hover:shadow-md ${selectedCat === o.category ? 'ring-2 ring-cyan-400 bg-blue-50' : ''}`}>
            <div className="text-2xl mb-1">{CAT_LABELS[o.category]?.split(' ')[0]}</div>
            <div className="font-semibold text-sm text-gray-800">{CAT_LABELS[o.category]?.split(' ').slice(1).join(' ')}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${o.avgScore}%` }} />
              </div>
              <span className="text-xs font-bold text-blue-900">{o.avgScore}</span>
            </div>
            <div className="mt-1"><ScoreBadge score={o.avgScore} /></div>
          </div>
        ))}
      </div>

      {/* Detail section */}
      {loading ? (
        <div className="card text-center py-8 text-gray-400">Menganalisis tren...</div>
      ) : data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Country recommendations */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">🌍 Negara Tujuan Ekspor — {CAT_LABELS[selectedCat]}</h2>
            <div className="space-y-3">
              {data.recommendations?.map((r, i) => (
                <div key={r.country} className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold w-5 text-sm">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 text-sm">{r.country}</span>
                      <ScoreBadge score={r.trendScore} />
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all" style={{ width: `${r.trendScore}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">Skor: {r.trendScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-3">💡 Strategi Pemasaran</h2>
              <ul className="space-y-2">
                {data.strategy?.tips?.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-cyan-500 font-bold">→</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-3">🛒 Platform Penjualan</h2>
              <div className="flex flex-wrap gap-2">
                {data.strategy?.platforms?.map(p => (
                  <span key={p} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200">{p}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-3">📜 Sertifikasi Direkomendasikan</h2>
              <div className="flex flex-wrap gap-2">
                {data.strategy?.certification?.map(c => (
                  <span key={c} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">✓ {c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Trend chart */}
          {data.trends?.length > 0 && (
            <div className="card lg:col-span-2">
              <h2 className="font-semibold text-gray-800 mb-4">📊 Grafik Tren Produk {CAT_LABELS[selectedCat]}</h2>
              <TrendBarChart data={data.trends} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
