import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
const MENU = [
  { to: '/', label: 'Dashboard', icon: '📊', min: 'reception' },
  { to: '/appointments', label: 'Lịch hẹn', icon: '📅', min: 'reception' },
  { to: '/patients', label: 'Bệnh nhân', icon: '🏥', min: 'reception' },
  { to: '/courses', label: '🎓 Khóa học', icon: '🎓', min: 'admin', new: true },
  { to: '/enrollments', label: '👨‍🎓 Học viên', icon: '👥', min: 'reception', new: true },
  { to: '/services', label: 'Dịch vụ', icon: '💚', min: 'admin' },
  { to: '/doctors', label: 'Bác sĩ', icon: '👨‍⚕️', min: 'admin' },
  { to: '/blogs', label: 'Tin tức', icon: '📰', min: 'admin' },
  { to: '/inventory', label: '📦 Kho dược', icon: '💊', min: 'pharmacist' },
  { to: '/accounting', label: '📊 Kế toán', icon: '💰', min: 'admin' },
  { to: '/users', label: '👥 Users', icon: '🔐', min: 'admin' },
  { to: '/settings', label: '⚙️ Cài đặt', icon: '⚙️', min: 'admin' },
];
export default function Layout({ children }) {
  const { user, logout, roleAtLeast } = useAuth();
  const nav = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside className="w-60 bg-emerald-800 text-white flex flex-col">
        <div className="p-4 border-b border-emerald-700"><div className="text-xl font-bold">DXGroup</div><div className="text-xs text-emerald-200">Admin v3.5 · KHÓA HỌC</div></div>
        <nav className="flex-1 p-2 space-y-1 text-sm">
          {MENU.filter(m => roleAtLeast(m.min)).map(m => (
            <NavLink key={m.to} to={m.to} end={m.to==='/'} className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}>
              <span>{m.icon}</span><span>{m.label}</span>
              {m.new && <span className="ml-auto text-[10px] bg-amber-400 text-emerald-900 px-1.5 rounded font-bold">MỚI</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-emerald-700 text-xs">
          <div className="font-semibold">{user?.full_name}</div>
          <div className="text-emerald-200">{user?.role}</div>
          <button onClick={() => { logout(); nav('/login'); }} className="mt-2 w-full bg-emerald-900 hover:bg-emerald-950 py-1.5 rounded">Đăng xuất</button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
