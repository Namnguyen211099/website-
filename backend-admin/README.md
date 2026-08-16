# DXGroup v3.5.1 · Phòng Khám Đông Y Fullstack

Bản này đã được harden sau audit: payment callback verification, idempotency, HttpOnly auth cookie, CORS allowlist, upload validation, database constraints, transaction-safe inventory/course payments và Admin CRUD cơ bản.

## Stack
- Backend: Node.js 18+ · Express · MySQL · JWT · bcryptjs
- Admin: React + Vite
- Integrations: VNPay · MoMo · Cloudinary · Nodemailer · node-cron · Multer

## Local
```bash
cd backend-admin
cp .env.example .env
# đặt JWT_SECRET >= 32 ký tự và cấu hình DB
npm install
npm run db:init
npm run dev
```

`PAYMENT_MOCK=true` chỉ dùng để test local. Production bắt buộc `PAYMENT_MOCK=false`.

## Database migration
Từ v3.4:
```bash
npm run db:migrate-v3.4-to-3.5
npm run db:migrate-v3.5.1
```
Hãy backup database trước khi migration.

## Authentication
Admin dùng HttpOnly cookie `dx_token`; frontend không lưu JWT trong localStorage. `Authorization: Bearer` vẫn được hỗ trợ cho API clients.

## Payment
- VNPay: chữ ký + amount được xác thực trước khi cập nhật đơn.
- MoMo: sử dụng HMAC-SHA256, IPN server-to-server và xác thực chữ ký.
- `payment_transactions` chống callback trùng và ghi nhận kế toán lặp.
- Mock payment chỉ hoạt động khi chủ động bật `PAYMENT_MOCK=true` ngoài production.

## Seed
`seed.sql` chứa dữ liệu demo và tài khoản mật khẩu `123456` để phát triển. **Không sử dụng các credential này trong production.** Hãy đổi hoặc bỏ seed accounts trước khi public hệ thống.

## Cấu trúc
```text
backend-admin/
├── config/
├── controllers/
├── middleware/
├── routes/
├── database/
├── cron/
├── public/
├── server.js
├── .env.example
└── package.json
```
