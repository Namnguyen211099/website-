const db = require('../config/db');
const { transaction } = require('../config/db');
const inventory = require('./inventoryController');
const accounting = require('./accountingController');

exports.getByPatient = async (req, res) => {
  const rows = await db.query('SELECT * FROM prescriptions WHERE patient_id=? ORDER BY created_at DESC', [req.params.pid]);
  for (const r of rows) r.items = await db.query('SELECT * FROM prescription_items WHERE prescription_id=?', [r.id]);
  res.json({ ok: true, data: rows });
};
exports.getById = async (req, res) => {
  const [r] = await db.query('SELECT * FROM prescriptions WHERE id=?', [req.params.id]);
  if (!r) return res.status(404).json({ ok: false });
  r.items = await db.query('SELECT * FROM prescription_items WHERE prescription_id=?', [r.id]);
  res.json({ ok: true, data: r });
};
exports.create = async (req, res) => {
  const b = req.body;
  const doctor_id = req.user.role === 'doctor' ? (req.user.doctor_profile_id || b.doctor_id) : b.doctor_id;
  const code = 'RX-' + String(Date.now()).slice(-6);
  const total = (b.items || []).reduce((s, i) => s + i.qty * i.unit_price, 0);
  const [rx] = await db.query(`INSERT INTO prescriptions (patient_id,doctor_id,record_id,code,total_amount,note) VALUES (?,?,?,?,?,?)`,
    [b.patient_id, doctor_id, b.record_id || null, code, total, b.note || '']);
  for (const it of b.items || []) await db.query('INSERT INTO prescription_items (prescription_id,item_id,item_name,qty,unit_price,dosage) VALUES (?,?,?,?,?,?)',
    [rx.insertId, it.item_id, it.item_name, parseInt(it.qty), parseFloat(it.unit_price), it.dosage || '']);
  res.json({ ok: true, id: rx.insertId, code });
};
exports.approve = async (req, res) => {
  const id = req.params.id;
  await transaction(async conn => {
    const [rx] = await conn.query('SELECT * FROM prescriptions WHERE id=?', [id]);
    if (!rx || rx.status !== 'draft') throw new Error('Đơn không ở trạng thái nháp');
    const items = await conn.query('SELECT * FROM prescription_items WHERE prescription_id=?', [id]);
    await inventory.dispensePrescription(conn, items.map(i => ({ ...i, prescription_id: id })));
    await conn.query("UPDATE prescriptions SET status='approved',approved_at=NOW() WHERE id=?", [id]);
    await accounting.autoRecordPayment({ type: 'income', category: 'thuoc', amount: rx.total_amount, method: 'cash', payer_payee: 'BN #' + rx.patient_id, reference_type: 'prescription', reference_id: id, note: 'Đơn thuốc ' + rx.code, conn });
  });
  res.json({ ok: true });
};
exports.cancel = async (req, res) => {
  await db.query("UPDATE prescriptions SET status='cancelled' WHERE id=?", [req.params.id]);
  res.json({ ok: true });
};
