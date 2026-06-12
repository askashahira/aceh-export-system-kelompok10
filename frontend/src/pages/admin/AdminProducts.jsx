import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { CATEGORY_LABELS } from '../../components/ui/TrendChart';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminAPI.getProducts().then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
    }).catch(() => toast.error('Gagal memuat produk'))
    .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.umkmName?.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data Produk UMKM</h1>
        <p className="text-gray-500 text-sm">{total} produk dari seluruh UMKM</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Cari nama produk / UMKM..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nama Produk', 'Kategori', 'UMKM', 'Harga', 'Rekomendasi Negara', 'Status', 'Dilihat'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800 max-w-[180px] truncate">{p.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.umkmName}</td>
                    <td className="py-3 px-4 font-medium text-blue-900">
                      Rp {p.price?.toLocaleString('id-ID')}<span className="text-xs text-gray-400">/{p.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.recommendedCountries?.slice(0, 2).map(c => (
                          <span key={c.country} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">{c.country}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{p.viewCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-8 text-gray-400">Tidak ada produk</div>}
          </div>
        </div>
      )}
    </div>
  );
}
