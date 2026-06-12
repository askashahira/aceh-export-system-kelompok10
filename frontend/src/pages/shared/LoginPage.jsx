import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Selamat datang, ${user.name}!`);
      if (user.role === 'umkm') navigate('/umkm');
      else if (user.role === 'exporter') navigate('/exporter');
      else navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3460] to-[#0a2342] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-cyan-400 font-extrabold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Masuk ke Akun</h1>
          <p className="text-gray-500 text-sm mt-1">Authentic Aceh Export System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="email@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-60">
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Demo akun:</p>
          <p>Admin: admin@aceh.id / admin123</p>
          <p>UMKM: umkm@aceh.id / umkm123</p>
          <p>Eksportir: eksportir@aceh.id / eksportir123</p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Belum punya akun? <Link to="/register" className="text-blue-900 font-semibold">Daftar sekarang</Link>
        </p>
        <p className="text-center mt-2"><Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Kembali ke beranda</Link></p>
      </div>
    </div>
  );
}
