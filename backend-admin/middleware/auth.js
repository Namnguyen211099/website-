const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET chưa được cấu hình');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.slice(7);
  if (!token && req.cookies?.dx_token) token = req.cookies.dx_token;
  if (!token) return res.status(401).json({ ok: false, error: 'Chưa đăng nhập' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await db.query('SELECT id,email,full_name,role,status,doctor_profile_id FROM users WHERE id=?', [decoded.id]);
    if (!users.length) return res.status(401).json({ ok: false, error: 'User không tồn tại' });
    if (users[0].status !== 'active') return res.status(403).json({ ok: false, error: 'Tài khoản bị khóa' });
    req.user = users[0];
    next();
  } catch (_) {
    res.status(401).json({ ok: false, error: 'Token không hợp lệ' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!['super_admin','admin'].includes(req.user.role)) return res.status(403).json({ ok: false, error: 'Chỉ Admin/Super' });
  next();
};
