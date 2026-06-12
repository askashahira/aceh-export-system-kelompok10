import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-blue-900 mb-4">404</div>
        <p className="text-gray-500 mb-6">Halaman tidak ditemukan</p>
        <button onClick={() => navigate('/')} className="btn-primary">Kembali ke Beranda</button>
      </div>
    </div>
  );
}
