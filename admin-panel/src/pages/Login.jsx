import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
export default function Login() {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const { login } = useAuth(); const nav = useNavigate();
  const s = async (ev) => { ev.preventDefault(); try { await login(e, p); nav('/'); } catch (err) { toast.error('Sai tài khoản/mật khẩu'); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900 p-4">
      <form onSubmit={s} className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6"><div className="text-3xl font-bold text-emerald-700">DXGroup</div><div className="text-sm text-gray-500">Admin v3.5 · KHÓA HỌC</div></div>
        <input className="w-full mb-3 border rounded px-3 py-2" value={e} onChange={e=>setE(e.target.value)} placeholder="Email" />
        <input type="password" className="w-full mb-4 border rounded px-3 py-2" value={p} onChange={e=>setP(e.target.value)} placeholder="Mật khẩu" />
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded font-semibold">Đăng nhập</button>
        <div className="mt-4 text-xs text-gray-500 text-center">Tài khoản quản trị được cấp trong môi trường triển khai.</div>
      </form>
    </div>
  );
}
