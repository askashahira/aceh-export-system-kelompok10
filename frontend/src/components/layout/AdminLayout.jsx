import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LayoutDashboard, Users, Package, BarChart2 } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Data UMKM & User' },
  { to: '/admin/products', icon: Package, label: 'Data Produk' },
  { to: '/admin/stats', icon: BarChart2, label: 'Statistik Ekspor' }
];

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} title="Dinas Perdagangan" />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
