import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LayoutDashboard, ShoppingBag, Globe } from 'lucide-react';

const links = [
  { to: '/exporter', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/exporter/catalog', icon: ShoppingBag, label: 'Katalog Produk' },
  { to: '/exporter/countries', icon: Globe, label: 'Data Negara' }
];

export default function ExporterLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} title="Eksportir" />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
