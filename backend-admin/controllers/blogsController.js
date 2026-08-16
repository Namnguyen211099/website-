const db = require('../config/db');
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,170);

exports.listPublic = async (req, res) => {
  const { cat, q, featured, limit } = req.query;
  let sql = "SELECT id,slug,title,category,excerpt,cover_image,author_id,views,published_at,created_at FROM blogs WHERE status='published'"; const p = [];
  if (cat) { sql += ' AND category=?'; p.push(cat); }
  if (featured) { sql += ' AND featured=1'; }
  if (q) { sql += ' AND (title LIKE ? OR excerpt LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY published_at DESC, id DESC';
  if (limit) { sql += ' LIMIT ?'; p.push(parseInt(limit)); }
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.getPublic = async (req, res) => {
  await db.query("UPDATE blogs SET views=views+1 WHERE slug=? AND status='published'", [req.params.slug]);
  const r = await db.query("SELECT * FROM blogs WHERE slug=? AND status='published'", [req.params.slug]);
  if (!r.length) return res.status(404).json({ ok: false, error: '404' });
  res.json({ ok: true, data: r[0] });
};
exports.adminList = async (req, res) => res.json({ ok: true, data: await db.query('SELECT * FROM blogs ORDER BY created_at DESC') });
exports.adminCreate = async (req, res) => {
  const b = req.body;
  const slug = b.slug || slugify(b.title) + '-' + Date.now().toString(36);
  const [r] = await db.query(`INSERT INTO blogs (slug,title,category,excerpt,content,cover_image,author_id,tags,featured,status,meta_title,meta_desc,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [slug, b.title, b.category || '', b.excerpt || '', b.content || '', b.cover_image || '', req.user.id, b.tags ? JSON.stringify(b.tags) : null, b.featured ? 1 : 0, b.status || 'published', b.meta_title || '', b.meta_desc || '', b.published_at || new Date().toISOString().slice(0,19).replace('T',' ')]);
  res.json({ ok: true, id: r.insertId, slug });
};
exports.adminUpdate = async (req, res) => {
  const b = req.body;
  await db.query(`UPDATE blogs SET title=?,category=?,excerpt=?,content=?,cover_image=?,tags=?,featured=?,status=?,meta_title=?,meta_desc=? WHERE id=?`,
    [b.title, b.category || '', b.excerpt || '', b.content || '', b.cover_image || '', b.tags ? JSON.stringify(b.tags) : null, b.featured ? 1 : 0, b.status || 'published', b.meta_title || '', b.meta_desc || '', req.params.id]);
  res.json({ ok: true });
};
exports.adminDelete = async (req, res) => { await db.query('DELETE FROM blogs WHERE id=?', [req.params.id]); res.json({ ok: true }); };
