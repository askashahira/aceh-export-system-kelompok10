import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, trendAPI } from '../../services/api';
import { TrendBarChart, CATEGORY_LABELS } from '../../components/ui/TrendChart';
import { Users, Package, TrendingUp, Globe, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    adminAPI.getUserStats().then(r => setUserStats(r.data)).catch(() => {});
    adminAPI.getStats().then(r => setProductStats(r.data)).catch(() => {});
    trendAPI.getTop().then(r => setTrends(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleRefreshTrends = async () => {
    setRefreshing(true);
    try {
      await trendAPI.refresh();
      toast.success('Data tren berhasil diperbarui dari Etsy API!');
      trendAPI.getTop().then(r => setTrends(r.data));
    } catch { toast.error('Gagal memperbarui tren'); }
    finally { setRefreshing(false); }
  };

  const stats = [
    { label: 'Total UMKM', value: userStats?.umkm ?? '—', icon: Users, color: 'bg-blue-100 text-blue-700', action: () => navigate('/admin/users') },
    { label: 'Total Eksportir', value: userStats?.exporter ?? '—', icon: Globe, color: 'bg-green-100 text-green-700', action: () => navigate('/admin/users') },
    { label: 'Total Produk', value: productStats?.totalProducts ?? '—', icon: Package, color: 'bg-purple-100 text-purple-700', action: () => navigate('/admin/products') },
    { label: 'Permintaan Ekspor', value: productStats?.totalInterests ?? '—', icon: TrendingUp, color: 'bg-orange-100 text-orange-700', action: () => navigate('/admin/stats') }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm">Dinas Perdagangan — Monitoring Ekspor UMKM Aceh</p>
        </div>
        <button onClick={handleRefreshTrends} disabled={refreshing}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Memperbarui...' : 'Refresh Tren Etsy'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, action }) => (
          <div key={label} onClick={action} className="card cursor-pointer hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📈 Tren Produk Global Terkini</h2>
          {trends.length > 0 ? <TrendBarChart data={trends.slice(0, 8)} /> : <p className="text-gray-400 text-sm py-8 text-center">Memuat...</p>}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📦 Produk per Kategori</h2>
          {productStats?.byCategory?.length > 0 ? (
            <div className="space-y-3">
              {productStats.byCategory.map(c => (
                <div key={c._id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28">{CATEGORY_LABELS[c._id] || c._id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(c.count / (productStats.totalProducts || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-6">{c.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm py-4 text-center">Belum ada produk</p>}
        </div>
      </div>

      {/* Top export countries */}
      {productStats?.byCountry?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">🌍 Negara Tujuan Ekspor Terpopuler</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {productStats.byCountry.map((c, i) => (
              <div key={c._id} className="text-center p-3 bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-xl">
                <div className="text-2xl font-extrabold text-blue-900">#{i + 1}</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">{c._id}</div>
                <div className="text-xs text-gray-400">{c.count} permintaan</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
