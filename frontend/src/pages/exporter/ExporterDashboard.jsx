import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trendAPI, productAPI } from '../../services/api';
import { TrendBarChart, ScoreBadge } from '../../components/ui/TrendChart';
import { ShoppingBag, Globe, TrendingUp } from 'lucide-react';

export default function ExporterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trends, setTrends] = useState([]);
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    trendAPI.getTop().then(r => setTrends(r.data)).catch(() => {});
    trendAPI.getCountries().then(r => setCountries(r.data.slice(0, 6))).catch(() => {});
    productAPI.getAll({ limit: 6 }).then(r => setProducts(r.data.products)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {user?.name}! 🌍</h1>
        <p className="text-gray-500 text-sm">{user?.companyName || 'Komunitas Eksportir'} — Dashboard Global</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Produk UMKM', value: products.length + '+', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700', action: () => navigate('/exporter/catalog') },
          { label: 'Negara Potensial', value: countries.length, icon: Globe, color: 'bg-green-100 text-green-700', action: () => navigate('/exporter/countries') },
          { label: 'Tren Aktif', value: trends.length, icon: TrendingUp, color: 'bg-purple-100 text-purple-700', action: () => {} }
        ].map(({ label, value, icon: Icon, color, action }) => (
          <div key={label} onClick={action} className="card cursor-pointer hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📈 Tren Produk Aceh Global</h2>
          {trends.length > 0 ? <TrendBarChart data={trends.slice(0, 8)} /> : <p className="text-gray-400 text-sm py-8 text-center">Memuat...</p>}
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">🌍 Negara dengan Permintaan Tertinggi</h2>
          <div className="space-y-3">
            {countries.map((c, i) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{c.country}</span>
                    <ScoreBadge score={c.avgScore} />
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${c.avgScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">📦 Produk UMKM Terbaru</h2>
          <button onClick={() => navigate('/exporter/catalog')} className="text-sm text-blue-900 hover:underline">Lihat semua →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p._id} onClick={() => navigate(`/exporter/catalog/${p._id}`)}
              className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-cyan-300 hover:shadow-sm transition-all">
              <div className="text-xs text-cyan-600 bg-cyan-50 inline-block px-2 py-0.5 rounded-full mb-2 capitalize">{p.category}</div>
              <div className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{p.name}</div>
              <div className="text-xs text-gray-500">{p.umkmName}</div>
              <div className="font-bold text-blue-900 text-sm mt-2">Rp {p.price?.toLocaleString('id-ID')}/{p.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
