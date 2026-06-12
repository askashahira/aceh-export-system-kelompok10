import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, recommendAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Lightbulb } from 'lucide-react';

const CATEGORIES = [
  { value: 'kopi', label: '☕ Kopi' }, { value: 'madu', label: '🍯 Madu' },
  { value: 'kerajinan', label: '🧶 Kerajinan' }, { value: 'fesyen_muslim', label: '👗 Fesyen Muslim' },
  { value: 'makanan', label: '🍱 Makanan' }, { value: 'rempah', label: '🌶️ Rempah' },
  { value: 'lainnya', label: '📦 Lainnya' }
];
const UNITS = ['kg', 'gram', 'pcs', 'set', 'lusin', 'kodi', 'meter', 'liter'];

export default function AddProduct() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ name: '', category: 'kopi', price: '', unit: 'kg', minOrder: 1, description: '', tags: '', umkmContact: { phone: '', whatsapp: '', email: '' } });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      productAPI.getOne(id).then(r => {
        const p = r.data;
        setForm({ name: p.name, category: p.category, price: p.price, unit: p.unit, minOrder: p.minOrder, description: p.description || '', tags: (p.tags || []).join(', '), umkmContact: p.umkmContact || { phone: '', whatsapp: '', email: '' } });
      });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setContact = (k, v) => setForm(f => ({ ...f, umkmContact: { ...f.umkmContact, [k]: v } }));

  const fetchRecommendation = async () => {
    if (!form.category) return;
    try {
      const r = await recommendAPI.forProduct({ category: form.category, productName: form.name });
      setRecommendation(r.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), price: Number(form.price), minOrder: Number(form.minOrder) };
      if (isEdit) { await productAPI.update(id, payload); toast.success('Produk diperbarui!'); }
      else { await productAPI.create(payload); toast.success('Produk berhasil ditambahkan!'); }
      navigate('/umkm/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/umkm/products')} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-700">Informasi Produk</h2>
          <div>
            <label className="label">Nama Produk *</label>
            <input className="input" placeholder="Contoh: Kopi Arabika Gayo Premium" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori *</label>
              <select className="input" value={form.category} onChange={e => { set('category', e.target.value); setRecommendation(null); }} required>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Satuan</label>
              <select className="input" value={form.unit} onChange={e => set('unit', e.target.value)}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Harga (Rp) *</label>
              <input className="input" type="number" placeholder="50000" value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div>
              <label className="label">Minimum Order</label>
              <input className="input" type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} min={1} />
            </div>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input" rows={3} placeholder="Ceritakan keunggulan produk Anda..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="label">Tags (pisahkan dengan koma)</label>
            <input className="input" placeholder="organik, premium, halal" value={form.tags} onChange={e => set('tags', e.target.value)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-700">Kontak UMKM (untuk eksportir)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Telepon</label>
              <input className="input" placeholder="08xx" value={form.umkmContact.phone} onChange={e => setContact('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <input className="input" placeholder="62xxx" value={form.umkmContact.whatsapp} onChange={e => setContact('whatsapp', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="usaha@email.com" value={form.umkmContact.email} onChange={e => setContact('email', e.target.value)} />
            </div>
          </div>
        </div>

        {/* AI Recommendation preview */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-blue-900 flex items-center gap-2"><Lightbulb size={16} /> Rekomendasi Pasar Ekspor</h2>
            <button type="button" onClick={fetchRecommendation} className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800">
              Analisis Kategori
            </button>
          </div>
          {recommendation ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {recommendation.recommendations?.map(r => (
                  <span key={r.country} className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full">
                    🌍 {r.country} — Skor {r.trendScore}
                  </span>
                ))}
              </div>
              {recommendation.strategy?.tips?.[0] && (
                <p className="text-xs text-blue-700 mt-2">💡 {recommendation.strategy.tips[0]}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-blue-600">Klik "Analisis Kategori" untuk melihat rekomendasi negara tujuan ekspor berdasarkan data tren terkini.</p>
          )}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/umkm/products')} className="btn-outline flex-1">Batal</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
            {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui Produk' : 'Simpan Produk')}
          </button>
        </div>
      </form>
    </div>
  );
}
