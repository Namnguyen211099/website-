# Deploy DXGroup v3.5 lên cPanel (5 bước)

## Yêu cầu hosting
- cPanel với **Node.js Selector 18+**
- MySQL 8.0+ / MariaDB 10.5+
- phpMyAdmin

## Bước 1: Upload code
- Upload `backend-admin/` vào thư mục **ngoài** `public_html/` (VD: `$HOME/backend-admin/`)
- Upload `admin-panel/dist/` → `$HOME/backend-admin/public/admin/`
- Upload Frontend React build → `public_html/`

## Bước 2: Tạo Node App (cPanel → Setup Node.js App)
- Node.js version: 18 hoặc 20
- Application mode: Production
- Application root: `backend-admin`
- Application URL: `api` (→ domain.com/api)
- Application startup file: `server.js`
- Chạy `npm install` trong giao diện Node.js Selector
- Tạo file `.env` từ `.env.example`, điền DB + JWT_SECRET

## Bước 3: Tạo CSDL (phpMyAdmin)
- Tạo DB + user → gán quyền ALL
- Import `backend-admin/database/schema.sql`
- Import `backend-admin/database/seed.sql` (data mẫu)
- **Nâng cấp từ v3.4 cũ**: chỉ cần import `database/migration-v3.4-to-v3.5.sql` (không mất data)

## Bước 4: .htaccess trong `public_html/`
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]
RewriteRule ^admin$ /api/admin/ [R,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

## Bước 5: Kiểm tra
- ✅ `https://yourdomain.com/api/health` → trả `version: "3.5.0"`
- ✅ `https://yourdomain.com/api/courses/featured` → 4 khóa nổi bật
- ✅ `https://yourdomain.com/api/admin/` → Admin Panel Login
- ✅ Đăng nhập `super@dxgroup.vn / 123456`

## Lưu ý quan trọng
- **Admin tách hẳn khỏi website**: khách vào `domain.com` **không thấy link nào** đến trang quản trị
- Admin truy cập: `domain.com/api/admin/` (chỉ người quản trị biết đường dẫn)
- Chạy mock VNPay/Momo khi chưa điền khóa: thanh toán tự động thành công để test
- Để bật thật: điền `VNPAY_TMNCODE` + `VNPAY_HASHSECRET` vào `.env` → restart Node App


## V3.5.1 security/production notes

1. Copy `backend-admin/.env.example` to `.env` and fill real credentials. The package intentionally no longer contains `.env`.
2. Set a random `JWT_SECRET` of at least 32 characters.
3. Set `CORS_ORIGIN` to the exact admin/frontend origins; never use `*` with credentials.
4. Set `PAYMENT_MOCK=false` in production. Mock payment is only available when explicitly enabled outside production.
5. Configure VNPay with `VNPAY_TMN_CODE`, `VNPAY_HASHSECRET`, `VNPAY_RETURN_URL`.
6. Configure MoMo with `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`, `MOMO_REDIRECT_URL`, and `MOMO_IPN_URL`.
7. For an existing v3.5 database run `database/migration-v3.5.1.sql` once. Back up the database first because the migration adds foreign keys and a unique payment-code constraint.
8. Admin authentication now uses an HttpOnly cookie. Do not put JWTs into localStorage.
9. The seed credentials are development fixtures only. Change or remove them before production.
10. Payment callbacks verify gateway signatures and amount server-side and use `payment_transactions` for idempotency.
