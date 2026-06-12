import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = [{ value: '', label: 'Semua' }, { value: 'kopi', label: '☕ Kopi' }, { value: 'madu', label: '🍯 Madu' }, { value: 'kerajinan', label: '🧶 Kerajinan' }, { value: 'fesyen_muslim', label: '👗 Fesyen Muslim' }, { value: 'makanan', label: '🍱 Makanan' }, { value: 'rempah', label: '🌶️ Rempah' }];

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const r = await productAPI.getAll({ search, category, page, limit: 12 });
      setProducts(r.data.products); setTotal(r.data.total);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, category, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Katalog Produk UMKM Aceh</h1>
        <p className="text-gray-500 text-sm">{total} produk tersedia</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Cari produk..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
              className={`text-sm px-3 py-2 rounded-lg border transition-all ${category === c.value ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Tidak ada produk ditemukan</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} onClick={() => navigate(`/exporter/catalog/${p._id}`)}
              className="card cursor-pointer hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full capitalize">{p.category}</span>
                {p.recommendedCountries?.[0] && (
                  <span className="text-xs text-green-600">📍 {p.recommendedCountries[0].country}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-900 transition-colors">{p.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{p.umkmName}</p>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description || '—'}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="font-bold text-blue-900">Rp {p.price?.toLocaleString('id-ID')}</span>
                  <span className="text-xs text-gray-400">/{p.unit}</span>
                </div>
                <span className="text-xs text-gray-400">Min {p.minOrder} {p.unit}</span>
              </div>
              <button className="w-full mt-3 text-sm bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">
                Lihat Detail & Kontak
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm ${page === p ? 'bg-blue-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
