const rateLimit = require('express-rate-limit');

// Giới hạn 10 lần thử đăng nhập/đăng ký sai trong 15 phút cho mỗi địa chỉ IP
// Chống dò mật khẩu tự động (brute-force)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Thử lại quá nhiều lần, vui lòng đợi vài phút rồi thử lại.' },
  skipSuccessfulRequests: true, // chỉ đếm các lần thử SAI, không đếm lần đăng nhập thành công
});
