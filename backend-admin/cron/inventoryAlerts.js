const cron = require('node-cron');
const nodemailer = require('nodemailer');
const db = require('../config/db');

const run = async () => {
  const today = new Date().toISOString().slice(0,10);
  const exp30 = await db.query("SELECT b.*,i.name FROM inventory_batches b JOIN inventory_items i ON i.id=b.item_id WHERE b.qty_remaining>0 AND b.expiry_date IS NOT NULL AND DATEDIFF(b.expiry_date,?)<=30 ORDER BY b.expiry_date", [today]);
  const low = await db.query("SELECT * FROM inventory_items WHERE qty<=alert_low ORDER BY qty");
  if (!exp30.length && !low.length) return;
  const recipients = (process.env.CRON_ALERT_EMAILS || 'super@dxgroup.vn,admin@dxgroup.vn,pharmacist@dxgroup.vn').split(',').map(s => s.trim()).filter(Boolean);
  try {
    const t = nodemailer.createTransport({ host: process.env.SMTP_HOST || '127.0.0.1', port: parseInt(process.env.SMTP_PORT || '1025') });
    const html = `<h3>Báo cáo tự động Kho DXGroup - ${today}</h3>
      <h4 style="color:#dc2626">Hết hạn trong 30 ngày (${exp30.length})</h4>
      <table border=1 cellpadding=6><tr><th>Mã lô</th><th>Tên</th><th>Hạn dùng</th><th>Còn lại</th></tr>
      ${exp30.map(b => `<tr><td>${b.batch_no}</td><td>${b.name}</td><td>${b.expiry_date}</td><td>${b.qty_remaining}</td></tr>`).join('') || '<tr><td colspan=4>Không có</td></tr>'}</table>
      <h4 style="color:#f59e0b">Tồn thấp dưới ngưỡng cảnh báo (${low.length})</h4>
      <table border=1 cellpadding=6><tr><th>SKU</th><th>Tên</th><th>Tồn</th><th>Ngưỡng</th></tr>
      ${low.map(i => `<tr><td>${i.sku}</td><td>${i.name}</td><td>${i.qty}</td><td>${i.alert_low}</td></tr>`).join('') || '<tr><td colspan=4>Không có</td></tr>'}</table>`;
    await t.sendMail({ from: 'DXGroup Cron <cron@dxgroup.vn>', to: recipients.join(','), subject: `[DXGroup Cron] Kho: ${exp30.length} hết hạn + ${low.length} tồn thấp`, html });
    console.log('[cron] Inventory alerts sent to', recipients);
  } catch (e) { console.error('[cron] email fail', e.message); }
};

if (require.main === module) { run().then(() => process.exit(0)); }
else if (process.env.CRON_INVENTORY_SCHEDULE !== 'off') {
  cron.schedule(process.env.CRON_INVENTORY_SCHEDULE || '0 7 * * *', run, { timezone: process.env.TZ || 'Asia/Ho_Chi_Minh' });
  console.log('[cron] Inventory alerts scheduled');
}
module.exports = { run };
