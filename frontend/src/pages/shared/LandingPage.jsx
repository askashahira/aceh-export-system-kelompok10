import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trendAPI } from '../../services/api';
import { TrendingUp, Globe, ShoppingBag, BarChart2, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topTrends, setTopTrends] = useState([]);

  useEffect(() => {
    trendAPI.getTop().then(r => setTopTrends(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const handleStart = () => {
    if (!user) return navigate('/login');
    if (user.role === 'umkm') return navigate('/umkm');
    if (user.role === 'exporter') return navigate('/exporter');
    if (user.role === 'admin') return navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3460] via-[#16213e] to-[#0a2342] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center font-bold text-blue-900 text-xl">A</div>
          <span className="font-bold text-lg">Authentic Aceh Export</span>
        </div>
        <div className="flex gap-3">
          {user ? (
            <button onClick={handleStart} className="btn-accent text-sm">Masuk Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-white/70 hover:text-white text-sm px-4 py-2">Masuk</button>
              <button onClick={() => navigate('/register')} className="btn-accent text-sm">Daftar Gratis</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-16 pb-24 text-center">
        <div className="inline-block bg-cyan-400/20 text-cyan-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-cyan-400/30">
          🚀 Platform Ekspor Digital UMKM Aceh
        </div>
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Ekspor Produk Aceh ke<br />
          <span className="text-cyan-400">Pasar Global</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
          Sistem rekomendasi cerdas berbasis data tren marketplace global. Ketahui produk mana yang diminati, negara mana yang menjanjikan, dan strategi terbaik untuk ekspor.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/register')} className="flex items-center gap-2 bg-cyan-400 text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition-all">
            Mulai Sekarang <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-white/30 px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-all">
            Sudah Punya Akun
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, title: 'Tren Global', desc: 'Data real-time dari Etsy & marketplace global' },
          { icon: Globe, title: 'Rekomendasi Negara', desc: 'Temukan pasar ekspor terbaik untuk produkmu' },
          { icon: ShoppingBag, title: 'Katalog UMKM', desc: 'Tampilkan produk ke komunitas eksportir' },
          { icon: BarChart2, title: 'Statistik Lengkap', desc: 'Monitoring ekspor oleh Dinas Perdagangan' }
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
            <Icon className="text-cyan-400 mb-3" size={28} />
            <div className="font-semibold mb-1 text-sm">{title}</div>
            <div className="text-white/50 text-xs">{desc}</div>
          </div>
        ))}
      </div>

      {/* Top Trends Preview */}
      {topTrends.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 pb-20">
          <h2 className="text-xl font-bold mb-4 text-center">Tren Produk Terkini</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topTrends.map(t => (
              <div key={t._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-cyan-300 mb-1 capitalize">{t.category}</div>
                <div className="font-semibold text-sm mb-2 line-clamp-2">{t.keyword}</div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">{t.trendScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/10 text-center py-6 text-white/30 text-sm">
        © 2024 Authentic Aceh Export — Kelompok 10 | Sistem Rekomendasi Pasar Ekspor Berbasis Global Market Trend Mining
      </div>
    </div>
  );
}
