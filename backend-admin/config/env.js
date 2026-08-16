const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
if (!isTest && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET phải được cấu hình và dài ít nhất 32 ký tự');
}
if (isProd && process.env.PAYMENT_MOCK === 'true') throw new Error('PAYMENT_MOCK không được bật trong production');
if (isProd && (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*')) throw new Error('CORS_ORIGIN phải là origin cụ thể trong production');
if (isProd && process.env.COOKIE_SECURE !== 'true') throw new Error('COOKIE_SECURE=true là bắt buộc trong production');
exports.isProd=isProd;
exports.isTest=isTest;
