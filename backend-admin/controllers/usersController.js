const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { ROLE_LEVEL } = require('../middleware/hasRole');

const filterOutSuper = (rows, me) => ROLE_LEVEL[me.role] > 1 ? rows.filter(r => r.role !== 'super_admin') : rows;

exports.stats = async (req, res) => {
  const byRole = await db.query('SELECT role, COUNT(*) c FROM users GROUP BY role');
  const [totalRow] = await db.query('SELECT COUNT(*) c FROM users');
  const total = Number(totalRow.c);
  res.json({ ok: true, data: { total, byRole } });
};
exports.getById = async (req,res) => {
  const [row] = await db.query('SELECT id,email,full_name,phone,role,status,last_login_at,created_at,updated_at FROM users WHERE id=?',[req.params.id]);
  if (!row || (row.role === 'super_admin' && req.user.role !== 'super_admin')) return res.status(404).json({ok:false,error:'User không tồn tại'});
  res.json({ok:true,data:row});
};
exports.list = async (req, res) => {
  const { role, q, status } = req.query;
  let sql = 'SELECT id,email,full_name,phone,role,status,last_login_at,created_at FROM users WHERE 1=1'; const p = [];
  if (role) { sql += ' AND role=?'; p.push(role); }
  if (status) { sql += ' AND status=?'; p.push(status); }
  if (q) { sql += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += ' ORDER BY id DESC';
  res.json({ ok: true, data: filterOutSuper(await db.query(sql, p), req.user) });
};
exports.create = async (req, res) => {
  const b = req.body;
  if (!b.email || !b.full_name || !b.password || String(b.password).length < 8) return res.status(400).json({ok:false,error:'Email, họ tên và mật khẩu >= 8 ký tự là bắt buộc'});
  if (b.role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ ok: false, error: 'Chỉ Super tạo Super' });
  const exists = await db.query('SELECT id FROM users WHERE email=?', [b.email]);
  if (exists.length) return res.status(400).json({ ok: false, error: 'Email đã tồn tại' });
  const [r] = await db.query('INSERT INTO users (email,password,full_name,phone,role,status) VALUES (?,?,?,?,?,?)',
    [b.email, await bcrypt.hash(b.password, 12), b.full_name, b.phone || '', b.role || 'member', b.status || 'active']);
  res.json({ ok: true, id: r.insertId });
};
exports.update = async (req, res) => {
  const b = req.body;
  const [target] = await db.query('SELECT role FROM users WHERE id=?', [req.params.id]);
  if (!target) return res.status(404).json({ ok: false });
  if (target.role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ ok: false });
  if (b.role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ ok: false });
  if (Number(req.params.id) === Number(req.user.id) && b.role && b.role !== req.user.role) return res.status(400).json({ok:false,error:'Không thể tự đổi role của chính mình'});
  const fields = ['full_name','phone','role','status'];
  const sets = [], vals = [];
  fields.forEach(f => { if (b[f] !== undefined) { sets.push(`${f}=?`); vals.push(b[f]); } });
  if (b.password) {
    if (String(b.password).length < 8) return res.status(400).json({ok:false,error:'Mật khẩu phải có ít nhất 8 ký tự'});
    sets.push('password=?'); vals.push(await bcrypt.hash(b.password, 12));
  }
  vals.push(req.params.id);
  await db.query(`UPDATE users SET ${sets.join(',')} WHERE id=?`, vals);
  res.json({ ok: true });
};
exports.remove = async (req, res) => {
  const [target] = await db.query('SELECT role FROM users WHERE id=?', [req.params.id]);
  if (!target) return res.status(404).json({ok:false,error:'User không tồn tại'});
  if (target.role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ ok: false });
  if (Number(req.params.id) === Number(req.user.id)) return res.status(400).json({ok:false,error:'Không thể tự xóa tài khoản đang đăng nhập'});
  await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
  res.json({ ok: true });
};
