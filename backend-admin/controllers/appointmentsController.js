const db = require('../config/db');
exports.createPublic = async (req, res) => {
  const b = req.body;
  if (!b.full_name || !b.phone || !b.appt_date || !b.appt_time) return res.status(400).json({ ok: false, error: 'Thiếu thông tin bắt buộc' });
  const code = 'APT-' + String(Date.now()).slice(-6);
  const [r] = await db.query(`INSERT INTO appointments (code,patient_id,service_id,doctor_id,full_name,phone,email,appt_date,appt_time,note,amount,source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [code, b.patient_id || null, b.service_id || null, b.doctor_id || null, b.full_name, b.phone, b.email || '', b.appt_date, b.appt_time, b.note || '', parseFloat(b.amount || 0), b.source || 'website']);
  res.json({ ok: true, id: r.insertId, code });
};
exports.adminList = async (req, res) => {
  const { status, date, q } = req.query;
  let sql = 'SELECT * FROM appointments WHERE 1=1'; const p = [];
  if (status) { sql += ' AND status=?'; p.push(status); }
  if (date) { sql += ' AND appt_date=?'; p.push(date); }
  if (q) { sql += ' AND (full_name LIKE ? OR phone LIKE ? OR code LIKE ?)'; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += ' ORDER BY appt_date DESC, appt_time DESC LIMIT 500';
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.stats = async (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const [totalRow] = await db.query('SELECT COUNT(*) c FROM appointments');
  const [todayRow] = await db.query('SELECT COUNT(*) c FROM appointments WHERE appt_date=?', [today]);
  const [pendingRow] = await db.query("SELECT COUNT(*) c FROM appointments WHERE status='pending'");
  const [revenueRow] = await db.query("SELECT COALESCE(SUM(amount),0) s FROM appointments WHERE paid=1");
  const total=Number(totalRow.c), todayCnt=Number(todayRow.c), pending=Number(pendingRow.c), revenue=Number(revenueRow.s);
  res.json({ ok: true, data: { total, today: todayCnt, pending, revenue } });
};
exports.updateStatus = async (req, res) => {
  await db.query('UPDATE appointments SET status=? WHERE id=?', [req.body.status, req.params.id]);
  res.json({ ok: true });
};
