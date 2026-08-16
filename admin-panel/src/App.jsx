import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Appointments from './pages/Appointments.jsx';
import Services from './pages/Services.jsx';
import Doctors from './pages/Doctors.jsx';
import Blogs from './pages/Blogs.jsx';
import Users from './pages/Users.jsx';
import Accounting from './pages/Accounting.jsx';
import Inventory from './pages/Inventory.jsx';
import Patients from './pages/Patients.jsx';
import Courses from './pages/Courses.jsx';
import Enrollments from './pages/Enrollments.jsx';
import Settings from './pages/Settings.jsx';

const Require = ({ children, minRole = 'member' }) => {
  const { user, ready, roleAtLeast } = useAuth();
  if (!ready) return <div className="p-8">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roleAtLeast(minRole)) return <div className="p-8 text-red-600">Không đủ quyền truy cập</div>;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Require minRole="reception"><Dashboard /></Require>} />
      <Route path="/appointments" element={<Require minRole="reception"><Appointments /></Require>} />
      <Route path="/services" element={<Require minRole="admin"><Services /></Require>} />
      <Route path="/doctors" element={<Require minRole="admin"><Doctors /></Require>} />
      <Route path="/blogs" element={<Require minRole="admin"><Blogs /></Require>} />
      <Route path="/courses" element={<Require minRole="admin"><Courses /></Require>} />
      <Route path="/enrollments" element={<Require minRole="reception"><Enrollments /></Require>} />
      <Route path="/patients" element={<Require minRole="reception"><Patients /></Require>} />
      <Route path="/inventory" element={<Require minRole="pharmacist"><Inventory /></Require>} />
      <Route path="/accounting" element={<Require minRole="admin"><Accounting /></Require>} />
      <Route path="/users" element={<Require minRole="admin"><Users /></Require>} />
      <Route path="/settings" element={<Require minRole="admin"><Settings /></Require>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
