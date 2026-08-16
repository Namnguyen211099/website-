// database/migrate.js
// Script tự import schema + dữ liệu mẫu, chạy TỪ BÊN TRONG Northflank
// (dùng kết nối nội bộ/private, không cần bật "Publicly accessible").
//
// Cách chạy: xem hướng dẫn kèm theo (huong-dan-migrate-noibo.md)

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSqlFile(connection, filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');

  // Tách câu lệnh theo dấu ; ở cuối dòng, bỏ qua comment (-- ...)
  const cleaned = raw
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const statements = cleaned
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`\n>> Đang chạy file: ${path.basename(filePath)} (${statements.length} câu lệnh)`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await connection.query(statements[i]);
      process.stdout.write('.');
    } catch (err) {
      console.error(`\n!! Lỗi ở câu lệnh #${i + 1}:`, err.message);
      console.error('   Nội dung câu lệnh:', statements[i].slice(0, 120), '...');
      throw err;
    }
  }
  console.log(`\n>> Xong file: ${path.basename(filePath)}`);
}

(async () => {
  console.log('== BẮT ĐẦU IMPORT DATABASE ==');
  console.log('Kết nối tới:', process.env.DB_HOST, ':', process.env.DB_PORT || 3306);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: false,
  });

  try {
    await runSqlFile(connection, path.join(__dirname, 'schema-da-sua-v2.sql'));
    await runSqlFile(connection, path.join(__dirname, 'seed-da-sua.sql'));
    console.log('\n== HOÀN TẤT — DATABASE ĐÃ SẴN SÀNG ==');
  } catch (err) {
    console.error('\n== IMPORT THẤT BẠI — xem lỗi chi tiết ở trên ==');
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
})();
