import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Sidebar({ links, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="w-64 bg-[#0f3460] min-h-screen flex flex-col text-white fixed left-0 top-0 z-30">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center font-bold text-blue-900 text-lg">A</div>
          <div>
            <div className="font-bold text-sm leading-tight">Authentic Aceh</div>
            <div className="text-xs text-cyan-300 capitalize">{title}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to.split('/').length === 2}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-cyan-400 text-blue-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-white/50 capitalize">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  );
}
