const db = require('../config/db');
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,170);

const pickPublic = (r) => ({
  id: r.id, course_code: r.course_code, slug: r.slug, title: r.title, category: r.category, level: r.level,
  short_desc: r.short_desc, thumbnail: r.thumbnail, video_intro: r.video_intro,
  teacher_id: r.teacher_id, teacher_name: r.teacher_name, total_videos: r.total_videos, total_hours: r.total_hours,
  start_date: r.start_date, price_original: r.price_original, price_sale: r.price_sale,
  enrolled_count: r.enrolled_count, max_students: r.max_students, status: r.status,
  featured_home: r.featured_home, best_seller: r.best_seller, has_certificate: r.has_certificate,
  tags: r.tags ? JSON.parse(r.tags) : [], views: r.views, meta_title: r.meta_title, meta_desc: r.meta_desc,
  created_at: r.created_at
});

exports.listPublic = async (req, res) => {
  const { cat, level, status = 'open,opening_soon', featured, q, limit } = req.query;
  const statuses = String(status).split(',').filter(s=>['open','opening_soon','closed','draft'].includes(s));
  let sql = `SELECT * FROM courses WHERE status IN (${statuses.map(()=>'?').join(',') || '?'})`; const p = statuses.length ? statuses : ['open'];
  if (featured) { sql += ' AND featured_home=1'; }
  if (cat) { sql += ' AND category=?'; p.push(cat); }
  if (level) { sql += ' AND level=?'; p.push(level); }
  if (q) { sql += ' AND (title LIKE ? OR short_desc LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY sort_order, featured_home DESC, best_seller DESC, id DESC';
  if (limit) { sql += ' LIMIT ?'; p.push(parseInt(limit)); }
  const rows = await db.query(sql, p);
  res.json({ ok: true, data: rows.map(pickPublic) });
};
exports.featuredPublic = async (req, res) => {
  const rows = await db.query("SELECT * FROM courses WHERE status IN ('open','opening_soon') AND featured_home=1 ORDER BY sort_order, best_seller DESC LIMIT 4");
  res.json({ ok: true, data: rows.map(pickPublic) });
};
exports.getPublic = async (req, res) => {
  await db.query('UPDATE courses SET views=views+1 WHERE slug=?', [req.params.slug]);
  const [r] = await db.query('SELECT c.*, d.full_name d_name, d.specialty d_spec, d.bio d_bio, d.avatar d_avatar FROM courses c LEFT JOIN doctors d ON d.id=c.teacher_id WHERE c.slug=?', [req.params.slug]);
  if (!r || !['open','opening_soon'].includes(r.status)) return res.status(404).json({ ok: false, error: 'Khóa học không tồn tại' });
  const related = await db.query("SELECT * FROM courses WHERE id<>? AND status IN ('open','opening_soon') AND (category=? OR teacher_id=?) ORDER BY RAND() LIMIT 3", [r.id, r.category, r.teacher_id]);
  res.json({ ok: true, data: { ...pickPublic(r), description: r.description, curriculum: r.curriculum ? JSON.parse(r.curriculum) : [], teacher: r.teacher_id ? { id: r.teacher_id, full_name: r.d_name || r.teacher_name, specialty: r.d_spec, bio: r.d_bio, avatar: r.d_avatar } : null, related: related.map(pickPublic) } });
};
exports.stats = async (req, res) => {
  const [totalRow] = await db.query('SELECT COUNT(*) c FROM courses');
  const [openRow] = await db.query("SELECT COUNT(*) c FROM courses WHERE status='open'");
  const [studentsRow] = await db.query('SELECT COALESCE(SUM(enrolled_count),0) s FROM courses');
  const [revenueRow] = await db.query("SELECT COALESCE(SUM(amount_paid),0) s FROM course_enrollments WHERE payment_status='paid'");
  const total = Number(totalRow.c), open = Number(openRow.c), students = Number(studentsRow.s), revenue = Number(revenueRow.s);
  res.json({ ok: true, data: { total, open, students, revenue } });
};
exports.adminList = async (req, res) => {
  const { status, cat, q } = req.query;
  let sql = 'SELECT * FROM courses WHERE 1=1'; const p = [];
  if (status) { sql += ' AND status=?'; p.push(status); }
  if (cat) { sql += ' AND category=?'; p.push(cat); }
  if (q) { sql += ' AND (title LIKE ? OR course_code LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY id DESC';
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.adminGet = async (req, res) => {
  const [r] = await db.query('SELECT * FROM courses WHERE id=?', [req.params.id]);
  if (!r) return res.status(404).json({ ok: false });
  r.curriculum = r.curriculum ? JSON.parse(r.curriculum) : [];
  r.tags = r.tags ? JSON.parse(r.tags) : [];
  res.json({ ok: true, data: r });
};
exports.adminCreate = async (req, res) => {
  const b = req.body;
  const original = Number(b.price_original || 0), sale = Number(b.price_sale || 0);
  if (!b.title || original < 0 || sale < 0 || (sale > 0 && original > 0 && sale > original)) return res.status(400).json({ok:false,error:'Dữ liệu khóa học hoặc giá không hợp lệ'});
  const [mx] = await db.query("SELECT COALESCE(MAX(CAST(SUBSTRING(course_code,2) AS UNSIGNED)),0) m FROM courses WHERE course_code REGEXP '^K[0-9]+$'");
  const code = b.course_code || ('K' + String(mx.m + 1));
  const slug = b.slug || slugify(b.title) + '-' + Date.now().toString(36);
  let teacher_name = b.teacher_name || '';
  if (b.teacher_id && !teacher_name) {
    const [d] = await db.query('SELECT full_name, title FROM doctors WHERE id=?', [b.teacher_id]);
    if (d) teacher_name = (d.title ? d.title + ' ' : '') + d.full_name;
  }
  const [r] = await db.query(`INSERT INTO courses (course_code,slug,title,category,level,short_desc,description,curriculum,thumbnail,video_intro,teacher_id,teacher_name,total_videos,total_hours,start_date,price_original,price_sale,max_students,status,featured_home,best_seller,has_certificate,allow_reviews,tags,meta_title,meta_desc,sort_order,created_by,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [code, slug, b.title, b.category || '', b.level || 'co-ban', b.short_desc || '', b.description || '', b.curriculum ? JSON.stringify(b.curriculum) : null, b.thumbnail || '', b.video_intro || '', b.teacher_id || null, teacher_name, parseInt(b.total_videos || 0), parseFloat(b.total_hours || 0), b.start_date || null, parseFloat(b.price_original || 0), parseFloat(b.price_sale || 0), parseInt(b.max_students || 0), b.status || 'draft', b.featured_home ? 1 : 0, b.best_seller ? 1 : 0, b.has_certificate === false ? 0 : 1, b.allow_reviews === false ? 0 : 1, b.tags ? JSON.stringify(b.tags) : null, b.meta_title || '', b.meta_desc || '', parseInt(b.sort_order || 0), req.user.id, b.status !== 'draft' ? new Date().toISOString().slice(0,19).replace('T',' ') : null]);
  res.json({ ok: true, id: r.insertId, course_code: code, slug });
};
exports.adminUpdate = async (req, res) => {
  const b = req.body;
  const original = Number(b.price_original || 0), sale = Number(b.price_sale || 0);
  if (!b.title || original < 0 || sale < 0 || (sale > 0 && original > 0 && sale > original)) return res.status(400).json({ok:false,error:'Dữ liệu khóa học hoặc giá không hợp lệ'});
  let teacher_name = b.teacher_name;
  if (b.teacher_id && teacher_name === undefined) {
    const [d] = await db.query('SELECT full_name, title FROM doctors WHERE id=?', [b.teacher_id]);
    if (d) teacher_name = (d.title ? d.title + ' ' : '') + d.full_name;
  }
  await db.query(`UPDATE courses SET title=?,category=?,level=?,short_desc=?,description=?,curriculum=?,thumbnail=?,video_intro=?,teacher_id=?,${teacher_name !== undefined ? 'teacher_name=?,' : ''}total_videos=?,total_hours=?,start_date=?,price_original=?,price_sale=?,max_students=?,status=?,featured_home=?,best_seller=?,has_certificate=?,allow_reviews=?,tags=?,meta_title=?,meta_desc=?,sort_order=? WHERE id=?`,
    [b.title, b.category, b.level, b.short_desc, b.description, b.curriculum ? JSON.stringify(b.curriculum) : null, b.thumbnail, b.video_intro, b.teacher_id || null, ...(teacher_name !== undefined ? [teacher_name] : []), parseInt(b.total_videos || 0), parseFloat(b.total_hours || 0), b.start_date || null, parseFloat(b.price_original || 0), parseFloat(b.price_sale || 0), parseInt(b.max_students || 0), b.status, b.featured_home !== undefined ? (b.featured_home ? 1 : 0) : 0, b.best_seller !== undefined ? (b.best_seller ? 1 : 0) : 0, b.has_certificate !== undefined ? (b.has_certificate ? 1 : 0) : 1, b.allow_reviews !== undefined ? (b.allow_reviews ? 1 : 0) : 1, b.tags ? JSON.stringify(b.tags) : null, b.meta_title || '', b.meta_desc || '', parseInt(b.sort_order || 0), req.params.id]);
  res.json({ ok: true });
};
exports.adminDelete = async (req, res) => {
  await db.query('DELETE FROM courses WHERE id=?', [req.params.id]);
  res.json({ ok: true });
};
