const db = require('../config/db');
exports.getByPatient = async (req, res) => {
  const rows = await db.query('SELECT * FROM medical_records WHERE patient_id=? ORDER BY visit_date DESC', [req.params.pid]);
  res.json({ ok: true, data: rows });
};
exports.create = async (req, res) => {
  const b = req.body;
  const doctor_id = req.user.role === 'doctor' ? (req.user.doctor_profile_id || b.doctor_id) : b.doctor_id;
  const [r] = await db.query(`INSERT INTO medical_records (patient_id,doctor_id,appointment_id,visit_date,chief_complaint,diagnosis,the_trang,treatment,note) VALUES (?,?,?,?,?,?,?,?,?)`,
    [b.patient_id, doctor_id, b.appointment_id || null, b.visit_date || new Date().toISOString().slice(0,19).replace('T',' '), b.chief_complaint || '', b.diagnosis || '', b.the_trang || '', b.treatment || '', b.note || '']);
  res.json({ ok: true, id: r.insertId });
};
exports.update = async (req, res) => {
  const b = req.body;
  await db.query('UPDATE medical_records SET chief_complaint=?,diagnosis=?,the_trang=?,treatment=?,note=? WHERE id=?',
    [b.chief_complaint, b.diagnosis, b.the_trang, b.treatment, b.note, req.params.id]);
  res.json({ ok: true });
};
