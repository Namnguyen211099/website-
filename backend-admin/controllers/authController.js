const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-only-secret-please-do-not-use-in-production-123456' : '');
const JWT_EXP = process.env.JWT_EXP || '7d';
const COOKIE_NAME = 'dx_token';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXP });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Nhập email + mật khẩu' });
  const users = await db.query('SELECT * FROM users WHERE email=?', [email.toLowerCase().trim()]);
  if (!users.length) return res.status(401).json({ ok: false, error: 'Email/mật khẩu sai' });
  const u = users[0];
  if (u.status !== 'active') return res.status(403).json({ ok: false, error: 'Tài khoản bị khóa' });
  if (!(await bcrypt.compare(password, u.password))) return res.status(401).json({ ok: false, error: 'Email/mật khẩu sai' });
  await db.query('UPDATE users SET last_login_at=NOW() WHERE id=?', [u.id]);
  res.cookie(COOKIE_NAME, signToken(u.id), cookieOptions);
  res.json({ ok: true, user: { id: u.id, email: u.email, full_name: u.full_name, role: u.role, phone: u.phone } });
};

exports.register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;
  if (!email || !password || !full_name) return res.status(400).json({ ok: false, error: 'Thiếu thông tin' });
  if (String(password).length < 8) return res.status(400).json({ ok: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' });
  const normalizedEmail = email.toLowerCase().trim();
  const exists = await db.query('SELECT id FROM users WHERE email=?', [normalizedEmail]);
  if (exists.length) return res.status(400).json({ ok: false, error: 'Email đã có tài khoản' });
  const hash = await bcrypt.hash(password, 12);
  const [r] = await db.query('INSERT INTO users (email,password,full_name,phone,role) VALUES (?,?,?,?,?)',
    [normalizedEmail, hash, full_name.trim(), phone || '', 'member']);
  try {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || '127.0.0.1', port: parseInt(process.env.SMTP_PORT || '1025'), secure: false });
    await transporter.sendMail({ from: 'DXGroup <no-reply@dxgroup.vn>', to: normalizedEmail, subject: 'Chào mừng đến DXGroup',
      text: `Chào ${full_name},\n\nTài khoản DXGroup của bạn đã được tạo.\n\nTrân trọng,\nDXGroup` });
  } catch (_) {}
  res.cookie(COOKIE_NAME, signToken(r.insertId), cookieOptions);
  res.json({ ok: true, user: { id: r.insertId, email: normalizedEmail, full_name: full_name.trim(), role: 'member' } });
};

exports.me = async (req, res) => res.json({ ok: true, user: req.user });

exports.logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production', sameSite: process.env.COOKIE_SAMESITE || 'lax', path: '/' });
  res.json({ ok: true });
};

exports.changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password || String(new_password).length < 8) return res.status(400).json({ ok: false, error: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
  const [u] = await db.query('SELECT password FROM users WHERE id=?', [req.user.id]);
  if (!u || !(await bcrypt.compare(old_password, u.password))) return res.status(400).json({ ok: false, error: 'Mật khẩu cũ sai' });
  await db.query('UPDATE users SET password=? WHERE id=?', [await bcrypt.hash(new_password, 12), req.user.id]);
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production', sameSite: process.env.COOKIE_SAMESITE || 'lax', path: '/' });
  res.json({ ok: true });
};
