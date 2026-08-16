const db = require('../config/db');
const { transaction } = require('../config/db');

const recomputeItemQty = async (conn, item_id) => {
  const [r] = await conn.query('SELECT COALESCE(SUM(qty_remaining),0) s FROM inventory_batches WHERE item_id=?', [item_id]);
  const [c] = await conn.query('SELECT COALESCE(AVG(unit_cost),0) a FROM inventory_batches WHERE item_id=? AND qty_remaining>0', [item_id]);
  await conn.query('UPDATE inventory_items SET qty=?, avg_cost=? WHERE id=?', [r.s, c.a, item_id]);
};
const fifoAllocate = async (conn, item_id, qty) => {
  const batches = await conn.query('SELECT * FROM inventory_batches WHERE item_id=? AND qty_remaining>0 ORDER BY expiry_date IS NULL, expiry_date ASC, id ASC', [item_id]);
  let remaining = qty; const used = []; let total_cost = 0;
  for (const b of batches) {
    if (remaining <= 0) break;
    const take = Math.min(b.qty_remaining, remaining);
    await conn.query('UPDATE inventory_batches SET qty_remaining=qty_remaining-? WHERE id=?', [take, b.id]);
    used.push({ batch_id: b.id, qty: take, unit_cost: b.unit_cost });
    total_cost += take * b.unit_cost;
    remaining -= take;
  }
  if (remaining > 0) throw new Error('Kho không đủ hàng');
  return { used, avg_cost: total_cost / qty };
};

exports.items = async (req, res) => {
  const { cat, q, alert } = req.query;
  let sql = 'SELECT * FROM inventory_items WHERE 1=1'; const p = [];
  if (cat) { sql += ' AND category=?'; p.push(cat); }
  if (q) { sql += ' AND (name LIKE ? OR sku LIKE ?)'; p.push(`%${q}%`, `%${q}%`); }
  if (alert === 'low') sql += ' AND qty <= alert_low';
  sql += ' ORDER BY name';
  res.json({ ok: true, data: await db.query(sql, p) });
};
exports.createItem = async (req, res) => {
  const b = req.body;
  const [r] = await db.query('INSERT INTO inventory_items (sku,name,category,unit,alert_low,expiry_alert_days,note) VALUES (?,?,?,?,?,?,?)',
    [b.sku, b.name, b.category || 'Thảo dược', b.unit || 'viên', parseInt(b.alert_low || 10), parseInt(b.expiry_alert_days || 30), b.note || '']);
  res.json({ ok: true, id: r.insertId });
};
exports.updateItem = async (req, res) => {
  const b = req.body;
  await db.query('UPDATE inventory_items SET name=?,category=?,unit=?,alert_low=?,note=? WHERE id=?',
    [b.name, b.category, b.unit, parseInt(b.alert_low || 10), b.note || '', req.params.id]);
  res.json({ ok: true });
};
exports.inbound = async (req, res) => {
  const { item_id, batches, note } = req.body;
  const id = await transaction(async conn => {
    let firstBatchId;
    for (const b of batches) {
      const [r] = await conn.query('INSERT INTO inventory_batches (item_id,batch_no,qty_in,qty_remaining,unit_cost,expiry_date,inbound_date,note) VALUES (?,?,?,?,?,?,?,?)',
        [item_id, b.batch_no, parseInt(b.qty), parseInt(b.qty), parseFloat(b.unit_cost), b.expiry_date || null, b.inbound_date || new Date().toISOString().slice(0,10), note || '']);
      if (!firstBatchId) firstBatchId = r.insertId;
      await conn.query('INSERT INTO inventory_transactions (item_id,batch_id,tx_type,qty,unit_cost,reference_type,note,created_by) VALUES (?,?,?,?,?,?,?,?)',
        [item_id, r.insertId, 'in', parseInt(b.qty), parseFloat(b.unit_cost), 'inbound', note || '', req.user.id]);
    }
    await recomputeItemQty(conn, item_id);
    return firstBatchId;
  });
  res.json({ ok: true, batch_id: id });
};
exports.outbound = async (req, res) => {
  const { item_id, qty, note } = req.body;
  await transaction(async conn => {
    const { used, avg_cost } = await fifoAllocate(conn, item_id, parseInt(qty));
    for (const u of used) await conn.query('INSERT INTO inventory_transactions (item_id,batch_id,tx_type,qty,unit_cost,reference_type,note,created_by) VALUES (?,?,?,?,?,?,?,?)',
      [item_id, u.batch_id, 'out', u.qty, u.unit_cost, 'outbound', note || '', req.user.id]);
    await recomputeItemQty(conn, item_id);
  });
  res.json({ ok: true });
};
exports.dispensePrescription = async (conn, items) => {
  for (const it of items) {
    const { avg_cost } = await fifoAllocate(conn, it.item_id, parseInt(it.qty));
    await conn.query('INSERT INTO inventory_transactions (item_id,tx_type,qty,unit_cost,reference_type,reference_id) VALUES (?,?,?,?,?,?)',
      [it.item_id, 'out', parseInt(it.qty), avg_cost, 'prescription', it.prescription_id]);
    await recomputeItemQty(conn, it.item_id);
  }
};
exports.stocktake = async (req, res) => {
  const { item_id, actual_qty, note } = req.body;
  const actual = Number(actual_qty);
  if (!Number.isInteger(actual) || actual < 0) return res.status(400).json({ok:false,error:'Số lượng kiểm kê không hợp lệ'});
  try {
    const result = await transaction(async conn => {
      const [cur] = await conn.query('SELECT * FROM inventory_items WHERE id=? FOR UPDATE', [item_id]);
      if (!cur) throw Object.assign(new Error('Mặt hàng không tồn tại'),{status:404});
      const diff = actual - Number(cur.qty);
      if (diff > 0) {
        const [r] = await conn.query(
          'INSERT INTO inventory_batches (item_id,batch_no,qty_in,qty_remaining,unit_cost,inbound_date,note) VALUES (?,?,?,?,?,?,?)',
          [item_id,'STK-'+Date.now(),diff,diff,0,new Date().toISOString().slice(0,10),note||'']
        );
        await conn.query(
          'INSERT INTO inventory_transactions (item_id,batch_id,tx_type,qty,unit_cost,reference_type,note,created_by) VALUES (?,?,?,?,?,?,?,?)',
          [item_id,r.insertId,'stocktake',diff,0,'stocktake',`Kiểm kê: ${cur.qty}→${actual} ${note||''}`,req.user.id]
        );
      } else if (diff < 0) {
        const {used}=await fifoAllocate(conn,item_id,-diff);
        for(const u of used) await conn.query(
          'INSERT INTO inventory_transactions (item_id,batch_id,tx_type,qty,unit_cost,reference_type,note,created_by) VALUES (?,?,?,?,?,?,?,?)',
          [item_id,u.batch_id,'stocktake',-u.qty,u.unit_cost,'stocktake',`Kiểm kê: ${cur.qty}→${actual} ${note||''}`,req.user.id]
        );
      } else {
        await conn.query(
          'INSERT INTO inventory_transactions (item_id,tx_type,qty,reference_type,note,created_by) VALUES (?,?,?,?,?,?)',
          [item_id,'stocktake',0,'stocktake',`Kiểm kê không chênh lệch: ${actual} ${note||''}`,req.user.id]
        );
      }
      await recomputeItemQty(conn,item_id);
      return diff;
    });
    res.json({ok:true,diff:result});
  } catch(e) { res.status(e.status||500).json({ok:false,error:e.message}); }
};
exports.alerts = async (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const exp30 = await db.query("SELECT b.*,i.name,i.sku FROM inventory_batches b JOIN inventory_items i ON i.id=b.item_id WHERE b.qty_remaining>0 AND b.expiry_date IS NOT NULL AND DATEDIFF(b.expiry_date,?) BETWEEN 0 AND 30 ORDER BY b.expiry_date", [today]);
  const exp90 = await db.query("SELECT b.*,i.name,i.sku FROM inventory_batches b JOIN inventory_items i ON i.id=b.item_id WHERE b.qty_remaining>0 AND b.expiry_date IS NOT NULL AND DATEDIFF(b.expiry_date,?) BETWEEN 31 AND 90 ORDER BY b.expiry_date", [today]);
  const low = await db.query("SELECT * FROM inventory_items WHERE qty<=alert_low ORDER BY qty");
  const [valueRow] = await db.query("SELECT COALESCE(SUM(b.qty_remaining*b.unit_cost),0) s FROM inventory_batches b WHERE b.qty_remaining>0");
  const [skuRow] = await db.query('SELECT COUNT(*) c FROM inventory_items');
  const totalValue=Number(valueRow.s), totalSKU=Number(skuRow.c);
  res.json({ ok:true, data:{ exp30, exp90, low, totalValue, totalSKU, expiringSoon:exp30.length+exp90.length } });
};
exports.monthlyValue = async (req, res) => {
  const rows = await db.query(`SELECT DATE_FORMAT(t.created_at,'%Y-%m') m, SUM(CASE WHEN t.tx_type='in' THEN t.qty*t.unit_cost ELSE -t.qty*t.unit_cost END) v FROM inventory_transactions t WHERE t.created_at>=DATE_SUB(NOW(),INTERVAL 12 MONTH) GROUP BY m ORDER BY m`);
  res.json({ ok: true, data: rows });
};
