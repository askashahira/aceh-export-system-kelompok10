import React, { useEffect, useState } from 'react';
import { adminAPI, trendAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CATEGORY_LABELS } from '../../components/ui/TrendChart';

const PIE_COLORS = ['#0077b6', '#00b4d8', '#f4a261', '#2a9d8f', '#e76f51', '#264653', '#a8dadc'];

export default function AdminStats() {
  const [productStats, setProductStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    adminAPI.getStats().then(r => setProductStats(r.data)).catch(() => {});
    adminAPI.getUserStats().then(r => setUserStats(r.data)).catch(() => {});
    trendAPI.getTop().then(r => setTrends(r.data)).catch(() => {});
    adminAPI.getInterests().then(r => setInterests(r.data)).catch(() => {});
  }, []);

  const pieData = productStats?.byCategory?.map(c => ({
    name: CATEGORY_LABELS[c._id] || c._id,
    value: c.count
  })) || [];

  const countryChartData = productStats?.byCountry?.map(c => ({
    name: c._id,
    permintaan: c.count
  })) || [];

  const statusData = [
    { name: 'Baru', value: interests.filter(i => i.status === 'pending').length },
    { name: 'Ditinjau', value: interests.filter(i => i.status === 'reviewed').length },
    { name: 'Dihubungi', value: interests.filter(i => i.status === 'contacted').length },
    { name: 'Selesai', value: interests.filter(i => i.status === 'closed').length }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Statistik Ekspor</h1>
        <p className="text-gray-500 text-sm">Laporan lengkap aktivitas ekspor UMKM Aceh</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total UMKM', value: userStats?.umkm ?? 0, color: 'from-blue-500 to-blue-600' },
          { label: 'Total Eksportir', value: userStats?.exporter ?? 0, color: 'from-green-500 to-green-600' },
          { label: 'Produk Aktif', value: productStats?.activeProducts ?? 0, color: 'from-purple-500 to-purple-600' },
          { label: 'Total Permintaan', value: productStats?.totalInterests ?? 0, color: 'from-orange-500 to-orange-600' }
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5`}>
            <div className="text-3xl font-extrabold">{value}</div>
            <div className="text-sm text-white/80 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk per kategori pie */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">🥧 Distribusi Produk per Kategori</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-8">Belum ada data produk</p>}
        </div>

        {/* Negara permintaan */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">🌍 Permintaan per Negara Tujuan</h2>
          {countryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={countryChartData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="permintaan" fill="#0077b6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-8">Belum ada permintaan ekspor</p>}
        </div>

        {/* Tren Skor */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📈 Skor Tren Produk Aceh (Global)</h2>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trends.slice(0, 8).map(t => ({ name: t.keyword?.split(' ').slice(0, 2).join(' '), skor: t.trendScore }))} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="skor" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-8">Memuat data tren...</p>}
        </div>

        {/* Status permintaan */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">📋 Status Permintaan Ekspor</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm">Belum ada permintaan ekspor masuk</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Interests Table */}
      {interests.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">📬 Riwayat Permintaan Ekspor Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Eksportir', 'Produk', 'Negara', 'Jumlah', 'Status', 'Tanggal'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {interests.slice(0, 15).map(i => (
                  <tr key={i._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{i.exporterName}</td>
                    <td className="py-3 px-4 text-gray-600">{i.productId?.name || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">🌍 {i.country}</td>
                    <td className="py-3 px-4 text-gray-600">{i.quantity} {i.unit}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        i.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        i.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        i.status === 'contacted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{i.status}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{new Date(i.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
