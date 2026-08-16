import { useEffect, useState } from 'react';
import axios from 'axios';
const KPI = ({ label, value, color, sub }) => (
  <div className={`p-5 rounded-xl shadow-sm border-l-4 ${color} bg-white`}>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
);
export default function Dashboard() {
  const [d, setD] = useState({ apt: {}, users: {}, courses: {}, acc: { income: 0, expense: 0 } });
  useEffect(() => {
    Promise.all([
      axios.get('/api/appointments/stats').then(r => r.data.data).catch(() => ({})),
      axios.get('/api/users/stats').then(r => r.data.data).catch(() => ({})),
      axios.get('/api/courses/stats').then(r => r.data.data).catch(() => ({ total: 0, open: 0, students: 0, revenue: 0 })),
      axios.get('/api/accounting/summary').then(r => r.data.data).catch(() => ({ income: 0, expense: 0 })),
    ]).then(([apt, users, courses, acc]) => setD({ apt, users, courses, acc }));
  }, []);
  const fmt = n => new Intl.NumberFormat('vi-VN').format(n || 0);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard <span className="text-sm font-normal text-emerald-600">v3.5 · Khóa học đã kích hoạt</span></h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Lịch hẹn hôm nay" value={d.apt.today || 0} color="border-emerald-500" sub={`Tong ${d.apt.total || 0}`} />
        <KPI label="Doanh thu thang" value={fmt(d.acc.income) + ' d'} color="border-blue-500" />
        <KPI label="Thanh vien" value={d.users.total || 0} color="border-amber-500" />
        <KPI label="Cho xu ly" value={d.apt.pending || 0} color="border-rose-500" />
      </div>
      <h2 className="text-lg font-semibold mb-3 text-emerald-700">Module Khoa hoc v3.5</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Tong khoa hoc" value={d.courses.total || 0} color="border-emerald-600" sub={`${d.courses.open || 0} dang mo`} />
        <KPI label="Tong hoc vien" value={fmt(d.courses.students || 0)} color="border-teal-500" />
        <KPI label="Doanh thu Khoa hoc" value={fmt(d.courses.revenue || 0) + ' d'} color="border-amber-500" sub="category=khoa_hoc" />
        <KPI label="Chung chi" value={0} color="border-indigo-500" sub="CERT-DX-xxxxxx" />
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm text-sm text-gray-600 space-y-1">
        <div><b>Frontend goi API:</b> GET /courses/featured (Home 4 khoa) · /courses (list) · /courses/:slug (detail) · POST /courses/:id/register (dang ky)</div>
        <div><b>Auto Ke toan:</b> Thanh toan thanh cong → tu dong ghi category='khoa_hoc' vao accounting_entries</div>
      </div>
    </div>
  );
}
