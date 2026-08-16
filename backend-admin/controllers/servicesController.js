const db = require('../config/db');
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140);

exports.listPublic = async (req, res) => {
  const { cat, sort = 'sort_order', limit } = req.query;
  let sql = 'SELECT * FROM services WHERE published=1';
  const p = [];
  if (cat) { sql += ' AND category=?'; p.push(cat); }
  sql += ` ORDER BY ${sort==='price'?'price':'sort_order'} ASC, id DESC`;
  if (limit) { sql += ' LIMIT ?'; p.push(parseInt(limit)); }
  res.json({ ok: true, data: await db.query(sql, p) });
};

exports.getPublic = async (req, res) => {
  const rows = await db.query('SELECT * FROM services WHERE slug=? AND published=1', [req.params.slug]);
  if (!rows.length) return res.status(404).json({ ok: false, error: 'Không tìm thấy' });
  res.json({ ok: true, data: rows[0] });
};

exports.adminList = async (req, res) => res.json({ ok: true, data: await db.query('SELECT * FROM services ORDER BY sort_order, id DESC') });
exports.adminCreate = async (req, res) => {
  const b = req.body;
  const slug = b.slug || slugify(b.name) + '-' + Date.now().toString(36);
  const [r] = await db.query(`INSERT INTO services (slug,name,category,short_desc,description,price,duration_min,icon,image,featured,published,allow_booking,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [slug, b.name, b.category || '', b.short_desc || '', b.description || '', parseFloat(b.price || 0), parseInt(b.duration_min || 30), b.icon || '', b.image || '', b.featured ? 1 : 0, b.published === false ? 0 : 1, b.allow_booking === false ? 0 : 1, parseInt(b.sort_order || 0)]);
  res.json({ ok: true, id: r.insertId, slug });
};
exports.adminUpdate = async (req, res) => {
  const b = req.body;
  await db.query(`UPDATE services SET name=?,category=?,short_desc=?,description=?,price=?,duration_min=?,icon=?,image=?,featured=?,published=?,allow_booking=?,sort_order=? WHERE id=?`,
    [b.name, b.category || '', b.short_desc || '', b.description || '', parseFloat(b.price || 0), parseInt(b.duration_min || 30), b.icon || '', b.image || '', b.featured ? 1 : 0, b.published === false ? 0 : 1, b.allow_booking === false ? 0 : 1, parseInt(b.sort_order || 0), req.params.id]);
  res.json({ ok: true });
};
exports.adminDelete = async (req, res) => { await db.query('DELETE FROM services WHERE id=?', [req.params.id]); res.json({ ok: true }); };
