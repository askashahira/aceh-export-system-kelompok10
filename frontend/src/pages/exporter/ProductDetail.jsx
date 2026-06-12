import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, interestAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ScoreBadge } from '../../components/ui/TrendChart';
import toast from 'react-hot-toast';
import { ArrowLeft, Phone, MessageCircle, Mail, Send } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ exporterName: user?.name || '', exporterEmail: '', companyName: user?.companyName || '', country: user?.country || '', quantity: '', unit: 'kg', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    productAPI.getOne(id).then(r => { setProduct(r.data); setForm(f => ({ ...f, unit: r.data.unit })); }).catch(() => navigate('/exporter/catalog'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await interestAPI.submit({ ...form, productId: id, quantity: Number(form.quantity) });
      toast.success('Minat ekspor berhasil dikirim! UMKM akan menghubungi Anda.');
      setSubmitted(true); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal mengirim'); }
    finally { setSubmitting(false); }
  };

  if (!product) return <div className="text-center py-12 text-gray-400">Memuat...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/exporter/catalog')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
        <ArrowLeft size={16} /> Kembali ke Katalog
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full capitalize">{product.category}</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">{product.name}</h1>
            <p className="text-gray-500">oleh <span className="font-medium">{product.umkmName}</span></p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">Rp {product.price?.toLocaleString('id-ID')}</div>
            <div className="text-sm text-gray-400">per {product.unit}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Min. Order</span><p className="font-semibold">{product.minOrder} {product.unit}</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500">Kategori</span><p className="font-semibold capitalize">{product.category}</p></div>
        </div>

        {product.description && <p className="text-gray-600 mb-4">{product.description}</p>}

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t}</span>)}
          </div>
        )}

        {/* Rekomendasi negara */}
        {product.recommendedCountries?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">🌍 Rekomendasi Negara Ekspor</h3>
            <div className="flex flex-wrap gap-2">
              {product.recommendedCountries.map(c => (
                <div key={c.country} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <span className="text-sm font-medium text-blue-900">{c.country}</span>
                  <ScoreBadge score={c.trendScore} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kontak UMKM */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">📞 Kontak UMKM Langsung</h3>
          <div className="flex flex-wrap gap-3">
            {product.umkmContact?.phone && (
              <a href={`tel:${product.umkmContact.phone}`} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-all">
                <Phone size={14} /> {product.umkmContact.phone}
              </a>
            )}
            {product.umkmContact?.whatsapp && (
              <a href={`https://wa.me/${product.umkmContact.whatsapp}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm hover:bg-green-100 transition-all">
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {product.umkmContact?.email && (
              <a href={`mailto:${product.umkmContact.email}`}
                className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-all">
                <Mail size={14} /> {product.umkmContact.email}
              </a>
            )}
            {!product.umkmContact?.phone && !product.umkmContact?.whatsapp && !product.umkmContact?.email && (
              <p className="text-sm text-gray-400">Kontak belum tersedia. Gunakan form minat di bawah.</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Interest */}
      {submitted ? (
        <div className="card bg-green-50 border border-green-200 text-center py-6">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-semibold text-green-800">Minat Ekspor Terkirim!</h3>
          <p className="text-green-600 text-sm mt-1">UMKM akan meninjau dan menghubungi Anda segera.</p>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">📋 Ajukan Minat Ekspor</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-2">
              <Send size={14} /> {showForm ? 'Tutup Form' : 'Ajukan Minat'}
            </button>
          </div>
          {!showForm && <p className="text-sm text-gray-500">Klik "Ajukan Minat" untuk mengirimkan permintaan ke UMKM. UMKM akan menerima notifikasi dan menghubungi Anda.</p>}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Nama Anda *</label><input className="input" value={form.exporterName} onChange={e => setForm(f => ({ ...f, exporterName: e.target.value }))} required /></div>
                <div><label className="label">Email</label><input className="input" type="email" value={form.exporterEmail} onChange={e => setForm(f => ({ ...f, exporterEmail: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Nama Perusahaan</label><input className="input" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></div>
                <div><label className="label">Negara Tujuan *</label><input className="input" placeholder="Jepang, Malaysia..." value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Jumlah Pesanan *</label><input className="input" type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required min={1} /></div>
                <div><label className="label">Satuan</label><input className="input" value={form.unit} readOnly className="input bg-gray-50" /></div>
              </div>
              <div><label className="label">Catatan</label><textarea className="input" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Spesifikasi, jadwal, pertanyaan..." /></div>
              <button type="submit" disabled={submitting} className="w-full btn-primary py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                <Send size={16} /> {submitting ? 'Mengirim...' : 'Kirim Minat Ekspor'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
