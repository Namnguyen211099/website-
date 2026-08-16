const db = require('../config/db');
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140);

exports.listPublic = async (req, res) => {
  const { spec, q, limit } = req.query;
  let sql = 'SELECT * FROM doctors WHERE published=1'; const p = [];
  if (spec) { sql += ' AND specialty=?'; p.push(spec); }
  if (q) { sql += ' AND (full_name LIKE ? OR specialty LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY sort_order, featured DESC, id DESC';
  if (limit) { sql += ' LIMIT ?'; p.push(parseInt(limit)); }
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.getPublic = async (req, res) => {
  const r = await db.query('SELECT * FROM doctors WHERE slug=? AND published=1', [req.params.slug]);
  if (!r.length) return res.status(404).json({ ok: false, error: '404' });
  res.json({ ok: true, data: r[0] });
};
exports.adminList = async (req, res) => res.json({ ok: true, data: await db.query('SELECT * FROM doctors ORDER BY sort_order, id DESC') });
exports.adminCreate = async (req, res) => {
  const b = req.body;
  const slug = b.slug || slugify(b.full_name) + '-' + Date.now().toString(36);
  const [r] = await db.query(`INSERT INTO doctors (slug,user_id,full_name,title,specialty,years_exp,bio,education,schedule,avatar,featured,published,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [slug, b.user_id || null, b.full_name, b.title || '', b.specialty || '', parseInt(b.years_exp || 0), b.bio || '', b.education || '', b.schedule || '', b.avatar || '', b.featured ? 1 : 0, b.published === false ? 0 : 1, parseInt(b.sort_order || 0)]);
  res.json({ ok: true, id: r.insertId, slug });
};
exports.adminUpdate = async (req, res) => {
  const b = req.body;
  await db.query(`UPDATE doctors SET full_name=?,title=?,specialty=?,years_exp=?,bio=?,education=?,schedule=?,avatar=?,featured=?,published=?,sort_order=? WHERE id=?`,
    [b.full_name, b.title || '', b.specialty || '', parseInt(b.years_exp || 0), b.bio || '', b.education || '', b.schedule || '', b.avatar || '', b.featured ? 1 : 0, b.published === false ? 0 : 1, parseInt(b.sort_order || 0), req.params.id]);
  res.json({ ok: true });
};
exports.adminDelete = async (req, res) => { await db.query('DELETE FROM doctors WHERE id=?', [req.params.id]); res.json({ ok: true }); };
