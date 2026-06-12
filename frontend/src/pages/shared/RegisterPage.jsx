import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'umkm', businessName: '', businessCategory: '', phone: '', whatsapp: '', companyName: '', country: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Registrasi berhasil!');
      if (user.role === 'umkm') navigate('/umkm');
      else navigate('/exporter');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3460] to-[#0a2342] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-cyan-400 font-extrabold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Buat Akun Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilih role */}
          <div>
            <label className="label">Daftar sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'umkm', l: '🏪 UMKM Aceh' }, { v: 'exporter', l: '🌍 Komunitas Eksportir' }].map(({ v, l }) => (
                <button type="button" key={v} onClick={() => set('role', v)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === v ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nama Lengkap</label>
              <input className="input" placeholder="Nama Anda" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
          </div>

          {form.role === 'umkm' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Nama Usaha</label>
                  <input className="input" placeholder="CV. Kopi Gayo..." value={form.businessName} onChange={e => set('businessName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Kategori Produk</label>
                  <select className="input" value={form.businessCategory} onChange={e => set('businessCategory', e.target.value)}>
                    <option value="">Pilih kategori</option>
                    <option value="kopi">Kopi</option>
                    <option value="madu">Madu</option>
                    <option value="kerajinan">Kerajinan</option>
                    <option value="fesyen_muslim">Fesyen Muslim</option>
                    <option value="makanan">Makanan</option>
                    <option value="rempah">Rempah</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">No. Telepon</label>
                  <input className="input" placeholder="08xx..." value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input className="input" placeholder="62xxx..." value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {form.role === 'exporter' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nama Perusahaan</label>
                <input className="input" placeholder="PT. Export..." value={form.companyName} onChange={e => set('companyName', e.target.value)} />
              </div>
              <div>
                <label className="label">Negara</label>
                <input className="input" placeholder="Jepang, Malaysia..." value={form.country} onChange={e => set('country', e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun? <Link to="/login" className="text-blue-900 font-semibold">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
