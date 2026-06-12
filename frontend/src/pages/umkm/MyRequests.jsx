import React, { useEffect, useState } from 'react';
import { interestAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'reviewed', 'contacted', 'closed'];
const STATUS_LABELS = { pending: 'Baru', reviewed: 'Ditinjau', contacted: 'Dihubungi', closed: 'Selesai' };
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', reviewed: 'bg-blue-100 text-blue-700', contacted: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-600' };

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await interestAPI.getMyRequests(); setRequests(r.data); }
    catch { toast.error('Gagal memuat data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await interestAPI.updateStatus(id, status); toast.success('Status diperbarui'); load(); }
    catch { toast.error('Gagal memperbarui'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Permintaan Ekspor Masuk</h1>
        <p className="text-gray-500 text-sm">{requests.length} permintaan dari eksportir</p>
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Memuat...</div> :
        requests.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">
            <p className="text-lg mb-2">📭 Belum ada permintaan ekspor</p>
            <p className="text-sm">Permintaan dari eksportir akan muncul di sini setelah Anda memiliki produk yang ditampilkan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <div key={r._id} className="card hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                      <span className="text-sm font-semibold text-gray-800">{r.exporterName}</span>
                      {r.companyName && <span className="text-xs text-gray-400">({r.companyName})</span>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs">Produk</span><p className="font-medium text-gray-700">{r.productId?.name || '—'}</p></div>
                      <div><span className="text-gray-400 text-xs">Negara Tujuan</span><p className="font-medium text-gray-700">🌍 {r.country}</p></div>
                      <div><span className="text-gray-400 text-xs">Jumlah</span><p className="font-medium text-gray-700">{r.quantity} {r.unit}</p></div>
                      <div><span className="text-gray-400 text-xs">Tanggal</span><p className="font-medium text-gray-700">{new Date(r.createdAt).toLocaleDateString('id-ID')}</p></div>
                    </div>
                    {r.exporterEmail && (
                      <div className="text-sm">
                        <span className="text-gray-400 text-xs">Kontak eksportir: </span>
                        <a href={`mailto:${r.exporterEmail}`} className="text-blue-600 hover:underline">{r.exporterEmail}</a>
                      </div>
                    )}
                    {r.notes && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">📝 {r.notes}</p>}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <p className="text-xs text-gray-500 font-medium">Update Status:</p>
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => updateStatus(r._id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${r.status === s ? STATUS_COLORS[s] + ' border-current' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
