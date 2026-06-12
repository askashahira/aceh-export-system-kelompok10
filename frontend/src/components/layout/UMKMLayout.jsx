import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LayoutDashboard, Package, Bell, TrendingUp } from 'lucide-react';

const links = [
  { to: '/umkm', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/umkm/products', icon: Package, label: 'Produk Saya' },
  { to: '/umkm/recommendations', icon: TrendingUp, label: 'Rekomendasi Pasar' },
  { to: '/umkm/requests', icon: Bell, label: 'Permintaan Ekspor' }
];

export default function UMKMLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} title="UMKM" />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
