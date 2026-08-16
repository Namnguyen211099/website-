const db = require('../config/db');
exports.stats = async (req, res) => {
  const [totalRow] = await db.query('SELECT COUNT(*) c FROM patients');
  const [maleRow] = await db.query("SELECT COUNT(*) c FROM patients WHERE gender='male'");
  const [monthRow] = await db.query("SELECT COUNT(*) c FROM patients WHERE created_at>=DATE_FORMAT(NOW(),'%Y-%m-01')");
  const total=Number(totalRow.c), male=Number(maleRow.c), thisMonth=Number(monthRow.c);
  res.json({ ok: true, data: { total, male, female: total - male, thisMonth } });
};
exports.list = async (req, res) => {
  const { q, gender } = req.query;
  let sql = 'SELECT * FROM patients WHERE 1=1'; const p = [];
  if (req.user.role === 'doctor') { sql += ' AND assigned_doctor_id=?'; p.push(req.user.doctor_profile_id); }
  if (q) { sql += ' AND (full_name LIKE ? OR phone LIKE ? OR patient_code LIKE ?)'; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (gender) { sql += ' AND gender=?'; p.push(gender); }
  sql += ' ORDER BY id DESC LIMIT 500';
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.getById = async (req, res) => {
  const [p] = await db.query('SELECT * FROM patients WHERE id=?', [req.params.id]);
  if (!p) return res.status(404).json({ ok: false });
  if (req.user.role === 'doctor' && p.assigned_doctor_id !== req.user.doctor_profile_id) return res.status(403).json({ ok: false });
  const records = await db.query('SELECT * FROM medical_records WHERE patient_id=? ORDER BY visit_date DESC', [p.id]);
  const prescriptions = await db.query('SELECT * FROM prescriptions WHERE patient_id=? ORDER BY created_at DESC', [p.id]);
  res.json({ ok: true, data: { ...p, records, prescriptions } });
};
exports.create = async (req, res) => {
  const b = req.body;
  const [max] = await db.query("SELECT COALESCE(MAX(CAST(SUBSTRING(patient_code,4) AS UNSIGNED)),0) m FROM patients WHERE patient_code LIKE 'BN-%'");
  const code = 'BN-' + String(max.m + 1).padStart(6, '0');
  const [r] = await db.query(`INSERT INTO patients (patient_code,full_name,gender,birth_date,phone,email,address,blood_group,allergies,chronic_diseases,assigned_doctor_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [code, b.full_name, b.gender, b.birth_date || null, b.phone || '', b.email || '', b.address || '', b.blood_group || '', b.allergies || '', b.chronic_diseases || '', b.assigned_doctor_id || null]);
  res.json({ ok: true, id: r.insertId, patient_code: code });
};
exports.update = async (req, res) => {
  const b = req.body;
  await db.query('UPDATE patients SET full_name=?,gender=?,birth_date=?,phone=?,email=?,address=?,allergies=?,chronic_diseases=?,assigned_doctor_id=? WHERE id=?',
    [b.full_name, b.gender, b.birth_date || null, b.phone, b.email || '', b.address || '', b.allergies || '', b.chronic_diseases || '', b.assigned_doctor_id || null, req.params.id]);
  res.json({ ok: true });
};
