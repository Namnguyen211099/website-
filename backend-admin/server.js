require('dotenv').config();
require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(helmet({
  // Tắt CSP mặc định của helmet vì Admin Panel (React SPA) tự phục vụ file tĩnh
  // trong cùng domain — bật CSP mặc định dễ chặn nhầm script/style của chính app.
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = String(process.env.CORS_ORIGIN || 'http://localhost:4000')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true);
    return cb(new Error('CORS origin not allowed'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Health check (dùng để kiểm tra server có sống không) =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, version: '3.5.0', time: new Date().toISOString() });
});

// ===== Gắn các route API =====
// Nếu tên file/route không khớp 100% với bản gốc, log lỗi lúc require sẽ
// cho biết ngay file nào không tồn tại — dễ sửa hơn lỗi "MODULE_NOT_FOUND"
// mơ hồ như trước.
function mount(pathPrefix, routeFile) {
  try {
    app.use(pathPrefix, require(routeFile));
    console.log(`✔ Đã gắn route: ${pathPrefix} -> ${routeFile}`);
  } catch (err) {
    console.error(`✘ KHÔNG gắn được route ${pathPrefix} (${routeFile}):`, err.message);
  }
}

mount('/api/auth', './routes/auth');
mount('/api/patients', './routes/patients');
mount('/api/records', './routes/records');
mount('/api/prescriptions', './routes/prescriptions');
mount('/api/users', './routes/users');
mount('/api/inventory', './routes/inventory');
mount('/api/accounting', './routes/accounting');
mount('/api/appointments', './routes/appointments');
mount('/api/payment', './routes/payment');
mount('/api/blogs', './routes/blogs');
mount('/api/doctors', './routes/doctors');
mount('/api/services', './routes/services');
mount('/api/courses', './routes/courses');
mount('/api/upload', './routes/upload');
mount('/api/settings', './routes/settings');

// ===== Phục vụ giao diện Admin Panel (React đã build) tại /api/admin =====
app.use('/api/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.get('/api/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// ===== Xử lý route không tồn tại =====
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Không tìm thấy đường dẫn này' });
});

// ===== Xử lý lỗi chung =====
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err.message);
  res.status(err.status || 500).json({ ok: false, error: err.message || 'Lỗi máy chủ' });
});

app.listen(PORT, () => {
  console.log(`✅ DXGroup v3.5 API chạy trên :${PORT}`);
});
