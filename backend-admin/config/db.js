const mysql = require('mysql2/promise');
// DB_SSL=true bật SSL cho các nhà cung cấp MySQL quản lý (Aiven, PlanetScale, v.v.)
// yêu cầu bắt buộc SSL. rejectUnauthorized:false chấp nhận cho môi trường test;
// môi trường production nên nạp chứng chỉ CA thật qua DB_SSL_CA nếu có.
const useSsl = process.env.DB_SSL === 'true';
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dxgroup',
  waitForConnections: true,
  connectionLimit: 20,
  charset: 'utf8mb4_unicode_ci',
  ssl: useSsl
    ? (process.env.DB_SSL_CA
        ? { ca: process.env.DB_SSL_CA, rejectUnauthorized: true }
        : { rejectUnauthorized: false })
    : undefined
});
module.exports = pool;
module.exports.query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};
module.exports.transaction = async (fn) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally { conn.release(); }
};
