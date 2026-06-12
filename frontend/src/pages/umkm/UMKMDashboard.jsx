import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trendAPI, productAPI, interestAPI } from '../../services/api';
import { TrendBarChart, ScoreBadge } from '../../components/ui/TrendChart';
import { Package, Bell, TrendingUp, Globe, Plus } from 'lucide-react';

export default function UMKMDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trends, setTrends] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    trendAPI.getTop().then(r => setTrends(r.data)).catch(() => {});
    trendAPI.getCountries().then(r => setCountries(r.data.slice(0, 6))).catch(() => {});
    productAPI.getMine().then(r => setMyProducts(r.data)).catch(() => {});
    interestAPI.getMyRequests().then(r => setRequests(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Produk Saya', value: myProducts.length, icon: Package, color: 'bg-blue-100 text-blue-700', action: () => navigate('/umkm/products') },
    { label: 'Permintaan Masuk', value: requests.length, icon: Bell, color: 'bg-orange-100 text-orange-700', action: () => navigate('/umkm/requests') },
    { label: 'Tren Aktif', value: trends.length, icon: TrendingUp, color: 'bg-green-100 text-green-700', action: () => navigate('/umkm/recommendations') },
    { label: 'Negara Potensial', value: countries.length, icon: Globe, color: 'bg-purple-100 text-purple-700', action: () => navigate('/umkm/recommendations') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Selamat datang, {user?.name}! 👋</h1>
          <p className="text-gray-500 text-sm">{user?.businessName || 'UMKM Aceh'} — Dashboard Ekspor</p>
        </div>
        <button onClick={() => navigate('/umkm/products/add')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, action }) => (
          <div key={label} onClick={action} className="card cursor-pointer hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📈 Tren Produk Global Terkini</h2>
          {trends.length > 0 ? <TrendBarChart data={trends.slice(0, 8)} /> : <p className="text-gray-400 text-sm py-8 text-center">Memuat data tren...</p>}
        </div>

        {/* Top Countries */}
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
            {countries.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Memuat data...</p>}
          </div>
        </div>
      </div>

      {/* My Products Quick View */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">📦 Produk Saya</h2>
          <button onClick={() => navigate('/umkm/products')} className="text-sm text-blue-900 hover:underline">Lihat semua</button>
        </div>
        {myProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-3">Belum ada produk. Tambahkan produk pertama Anda!</p>
            <button onClick={() => navigate('/umkm/products/add')} className="btn-primary text-sm">+ Tambah Produk</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {myProducts.slice(0, 3).map(p => (
              <div key={p._id} className="border border-gray-100 rounded-xl p-4 hover:border-cyan-300 transition-all">
                <div className="text-xs text-cyan-600 bg-cyan-50 inline-block px-2 py-0.5 rounded-full mb-2 capitalize">{p.category}</div>
                <div className="font-medium text-gray-800 text-sm mb-1">{p.name}</div>
                <div className="text-gray-500 text-xs">Rp {p.price?.toLocaleString('id-ID')}/{p.unit}</div>
                {p.recommendedCountries?.[0] && (
                  <div className="mt-2 text-xs text-green-600">📍 {p.recommendedCountries[0].country}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Requests */}
      {requests.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">📬 Permintaan Ekspor Terbaru</h2>
            <button onClick={() => navigate('/umkm/requests')} className="text-sm text-blue-900 hover:underline">Lihat semua</button>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 3).map(r => (
              <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-sm text-gray-800">{r.exporterName} — {r.country}</div>
                  <div className="text-xs text-gray-500">{r.quantity} {r.unit} | {r.productId?.name}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {r.status === 'pending' ? 'Baru' : r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
