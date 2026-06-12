import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const CATEGORY_LABELS = { kopi:'Kopi', madu:'Madu', kerajinan:'Kerajinan', fesyen_muslim:'Fesyen Muslim', makanan:'Makanan', rempah:'Rempah', lainnya:'Lainnya' };

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try { const r = await productAPI.getMine(); setProducts(r.data); }
    catch { toast.error('Gagal memuat produk'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;
    try { await productAPI.delete(id); toast.success('Produk dihapus'); load(); }
    catch { toast.error('Gagal menghapus'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produk Saya</h1>
          <p className="text-gray-500 text-sm">{products.length} produk terdaftar</p>
        </div>
        <button onClick={() => navigate('/umkm/products/add')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-4">Belum ada produk. Tambahkan produk pertama Anda!</p>
          <button onClick={() => navigate('/umkm/products/add')} className="btn-primary">+ Tambah Produk</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full capitalize">{CATEGORY_LABELS[p.category] || p.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description || 'Tidak ada deskripsi'}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-blue-900">Rp {p.price?.toLocaleString('id-ID')}<span className="text-xs font-normal text-gray-400">/{p.unit}</span></span>
                <span className="text-xs text-gray-400">Min: {p.minOrder} {p.unit}</span>
              </div>
              {p.recommendedCountries?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Rekomendasi negara:</p>
                  <div className="flex flex-wrap gap-1">
                    {p.recommendedCountries.slice(0, 3).map(c => (
                      <span key={c.country} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">{c.country}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => navigate(`/umkm/products/edit/${p._id}`)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-blue-900 border border-blue-200 py-1.5 rounded-lg hover:bg-blue-50">
                  <Edit size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(p._id, p.name)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-red-600 border border-red-200 py-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
