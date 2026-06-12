import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

export function TrendBarChart({ data }) {
  const formatted = data.map(d => ({
    name: d.keyword?.split(' ').slice(0, 3).join(' ') || d._id,
    score: d.trendScore || d.avgScore || 0,
    volume: d.searchVolume || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
        <Tooltip formatter={(v, n) => [v, n === 'score' ? 'Skor Tren' : 'Volume']} />
        <Bar dataKey="score" fill="#0077b6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryRadialChart({ data }) {
  const colors = ['#0077b6', '#00b4d8', '#f4a261', '#2a9d8f', '#e76f51', '#264653', '#a8dadc'];
  const formatted = data.map((d, i) => ({
    name: CATEGORY_LABELS[d._id] || d._id,
    score: Math.round(d.avgScore),
    fill: colors[i % colors.length]
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadialBarChart innerRadius="20%" outerRadius="90%" data={formatted} startAngle={180} endAngle={0}>
        <RadialBar dataKey="score" label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} />
        <Tooltip formatter={(v) => [v, 'Skor']} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export const CATEGORY_LABELS = {
  kopi: 'Kopi', madu: 'Madu', kerajinan: 'Kerajinan',
  fesyen_muslim: 'Fesyen Muslim', makanan: 'Makanan', rempah: 'Rempah', lainnya: 'Lainnya'
};

export function ScoreBadge({ score }) {
  if (score >= 85) return <span className="badge-tinggi">🔥 Sangat Tinggi</span>;
  if (score >= 70) return <span className="badge-tinggi">✅ Tinggi</span>;
  if (score >= 50) return <span className="badge-sedang">📊 Sedang</span>;
  return <span className="badge-rendah">📉 Rendah</span>;
}
