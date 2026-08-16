const db = require('../config/db');
exports.getPublic = async (req, res) => {
  const group = req.params.group;
  const rows = await db.query(group === 'all' ? 'SELECT * FROM settings' : 'SELECT * FROM settings WHERE `group`=?', group === 'all' ? [] : [group]);
  const out = {}; rows.forEach(r => { if (!out[r.group]) out[r.group] = {}; out[r.group][r.key] = r.value; });
  res.json({ ok: true, data: out });
};
exports.adminUpsert = async (req, res) => {
  const b = req.body;
  await db.query('INSERT INTO settings (`group`,`key`,`value`,`type`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE value=?,`type`=?',
    [b.group || 'general', b.key, b.value || '', b.type || 'string', b.value || '', b.type || 'string']);
  res.json({ ok: true });
};
exports.adminBatch = async (req, res) => {
  const items = req.body.items || [];
  for (const b of items) {
    await db.query('INSERT INTO settings (`group`,`key`,`value`,`type`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE value=?',
      [b.group || 'general', b.key, b.value || '', b.type || 'string', b.value || '']);
  }
  res.json({ ok: true });
};
