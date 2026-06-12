import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, ToggleLeft, ToggleRight } from 'lucide-react';

const ROLE_LABELS = { umkm: 'UMKM', exporter: 'Eksportir', admin: 'Admin' };
const ROLE_COLORS = { umkm: 'bg-blue-100 text-blue-700', exporter: 'bg-green-100 text-green-700', admin: 'bg-purple-100 text-purple-700' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await adminAPI.getUsers({ role, page, limit: 15 });
      setUsers(r.data.users);
      setTotal(r.data.total);
    } catch { toast.error('Gagal memuat data user'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [role, page]);

  const handleToggle = async (id, name, isActive) => {
    if (!window.confirm(`${isActive ? 'Nonaktifkan' : 'Aktifkan'} akun "${name}"?`)) return;
    try {
      await adminAPI.toggleUser(id);
      toast.success(`Akun ${isActive ? 'dinonaktifkan' : 'diaktifkan'}`);
      load();
    } catch { toast.error('Gagal mengubah status'); }
  };

  const filtered = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data UMKM & Pengguna</h1>
        <p className="text-gray-500 text-sm">{total} pengguna terdaftar</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Cari nama / email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[{ v: '', l: 'Semua' }, { v: 'umkm', l: 'UMKM' }, { v: 'exporter', l: 'Eksportir' }, { v: 'admin', l: 'Admin' }].map(({ v, l }) => (
            <button key={v} onClick={() => { setRole(v); setPage(1); }}
              className={`text-sm px-3 py-2 rounded-lg border transition-all ${role === v ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nama', 'Email', 'Role', 'Usaha / Perusahaan', 'Kontak', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-900">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.businessName || u.companyName || '—'}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{u.phone || u.whatsapp || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleToggle(u._id, u.name, u.isActive)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${u.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}>
                        {u.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-8 text-gray-400">Tidak ada data</div>}
          </div>

          {/* Pagination */}
          {total > 15 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {Array.from({ length: Math.ceil(total / 15) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm ${page === p ? 'bg-blue-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
