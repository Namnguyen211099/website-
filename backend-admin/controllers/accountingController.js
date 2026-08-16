const db = require('../config/db');
exports.summary = async (req, res) => {
  const { from, to, group = 'day' } = req.query;
  const f = from || new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  const t = to || new Date().toISOString().slice(0,10);
  const [incomeRow] = await db.query("SELECT COALESCE(SUM(amount),0) s FROM accounting_entries WHERE type='income' AND entry_date BETWEEN ? AND ?", [f,t]);
  const [expenseRow] = await db.query("SELECT COALESCE(SUM(amount),0) s FROM accounting_entries WHERE type='expense' AND entry_date BETWEEN ? AND ?", [f,t]);
  const income = Number(incomeRow.s), expense = Number(expenseRow.s);
  const groupBy = group==='month'?"DATE_FORMAT(entry_date,'%Y-%m')":group==='week'?"YEARWEEK(entry_date,1)":'entry_date';
  const chart = await db.query(`SELECT ${groupBy} period, type, SUM(amount) amount FROM accounting_entries WHERE entry_date BETWEEN ? AND ? GROUP BY period, type ORDER BY period`, [f,t]);
  const topCat = await db.query(`SELECT category, SUM(amount) amount FROM accounting_entries WHERE type='income' AND entry_date BETWEEN ? AND ? GROUP BY category ORDER BY amount DESC LIMIT 5`, [f,t]);
  res.json({ ok: true, data: { from: f, to: t, income, expense, profit: income - expense, chart, topCat } });
};
exports.entries = async (req, res) => {
  const { from, to, type, method, q, limit = 200 } = req.query;
  let sql = 'SELECT * FROM accounting_entries WHERE 1=1'; const p = [];
  if (from) { sql += ' AND entry_date>=?'; p.push(from); }
  if (to) { sql += ' AND entry_date<=?'; p.push(to); }
  if (type) { sql += ' AND type=?'; p.push(type); }
  if (method) { sql += ' AND method=?'; p.push(method); }
  if (q) { sql += ' AND (payer_payee LIKE ? OR note LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY entry_date DESC, id DESC LIMIT ?'; p.push(parseInt(limit));
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.createEntry = async (req, res) => {
  const b = req.body;
  const [r] = await db.query(`INSERT INTO accounting_entries (entry_date,type,category,amount,method,payer_payee,note,created_by) VALUES (?,?,?,?,?,?,?,?)`,
    [b.entry_date || new Date().toISOString().slice(0,10), b.type, b.category, parseFloat(b.amount), b.method || 'cash', b.payer_payee || '', b.note || '', req.user.id]);
  res.json({ ok: true, id: r.insertId });
};
exports.autoRecordPayment = async ({ type = 'income', category, amount, method, payer_payee, reference_type, reference_id, note, conn }) => {
  const q = conn || db;
  await q.query(`INSERT INTO accounting_entries (entry_date,type,category,amount,method,payer_payee,reference_type,reference_id,note) VALUES (CURDATE(),?,?,?,?,?,?,?,?)`,
    [type, category, parseFloat(amount), method || 'cash', payer_payee || '', reference_type || null, reference_id || null, note || '']);
  return true;
};
