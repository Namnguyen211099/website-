# HƯỚNG DẪN CÀI ĐẶT CHI TIẾT - DXGroup v3.6

## 📋 Mục lục
1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Cài đặt Backend](#2-cài-đặt-backend)
3. [Cấu hình Database](#3-cấu-hình-database)
4. [Khởi động Backend](#4-khởi-động-backend)
5. [Cài đặt Frontend Admin Panel](#5-cài-đặt-frontend-admin-panel)
6. [Đăng nhập và sử dụng](#6-đăng-nhập-và-sử-dụng)
7. [Triển khai lên server](#7-triển-khai-lên-server)
8. [Xử lý sự cố thường gặp](#8-xử-lý-sự-cố-thường-gặp)

---

## 1. Yêu cầu hệ thống

### Phần mềm bắt buộc
- **Node.js**: 18.x hoặc cao hơn (khuyến nghị 20.x LTS)
- **MySQL**: 8.0+ hoặc **MariaDB**: 10.5+
- **npm**: 9.x+ hoặc **yarn**: 1.22+
- **Git**: (tùy chọn) để quản lý mã nguồn

### Kiểm tra phiên bản
```bash
node --version    # Phải >= 18
npm --version     # Phải >= 9
mysql --version   # Phải >= 8.0
```

---

## 2. Cài đặt Backend

### Bước 2.1: Di chuyển vào thư mục backend
```bash
cd backend-admin
```

### Bước 2.2: Cài đặt các gói phụ thuộc
```bash
npm install
```

Đợi quá trình cài đặt hoàn tất (có thể mất 1-3 phút).

### Bước 2.3: Tạo file cấu hình môi trường
```bash
cp .env.example .env
```

### Bước 2.4: Chỉnh sửa file .env
Mở file `.env` bằng trình soạn thảo và điền thông tin:

```env
# Cổng chạy server
PORT=5000

# Cấu hình Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root                  # Tên người dùng MySQL của bạn
DB_PASSWORD=your_password     # Mật khẩu MySQL của bạn
DB_NAME=dxgroup_db            # Tên database sẽ tạo

# Bảo mật
JWT_SECRET=mot_chuoi_ngau_nhien_dai_it_nhat_32_ky_tu_o_day
NODE_ENV=development

# CORS (cho phép frontend truy cập)
CORS_ORIGIN=http://localhost:4000

# Tích hợp (tùy chọn, có thể để trống khi phát triển)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Thanh toán (tùy chọn)
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=

# Chế độ mô phỏng thanh toán (chỉ dùng khi phát triển)
PAYMENT_MOCK=true
```

> ⚠️ **QUAN TRỌNG**: 
> - `JWT_SECRET` phải là chuỗi ngẫu nhiên dài ít nhất 32 ký tự
> - Khi triển khai sản xuất, đặt `PAYMENT_MOCK=false`
> - `CORS_ORIGIN` phải trùng với địa chỉ frontend của bạn

---

## 3. Cấu hình Database

### Bước 3.1: Tạo database mới
Mở MySQL Command Line hoặc phpMyAdmin:

```sql
CREATE DATABASE dxgroup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 3.2: Import cấu trúc bảng
```bash
# Cách 1: Dùng lệnh MySQL
mysql -u root -p dxgroup_db < database/schema.sql

# Cách 2: Dùng phpMyAdmin
# Mở phpMyAdmin -> Chọn database dxgroup_db -> Import -> Chọn file database/schema.sql
```

### Bước 3.3: Import dữ liệu mẫu
```bash
mysql -u root -p dxgroup_db < database/seed.sql
```

> ✅ Dữ liệu mẫu bao gồm:
> - Tài khoản admin: `super@dxgroup.vn / 123456`
> - Các dịch vụ, bác sĩ, bệnh nhân mẫu
> - Cài đặt hệ thống mặc định

---

## 4. Khởi động Backend

### Chế độ phát triển (có auto-reload)
```bash
npm run dev
```

### Chế độ sản xuất
```bash
npm start
```

### Kiểm tra hoạt động
Mở trình duyệt và truy cập:
```
http://localhost:5000/api/health
```

Nếu thấy kết quả tương tự:
```json
{
  "ok": true,
  "version": "3.5.1",
  "name": "DXGroup Backend",
  "modules": ["auth","users","services",...]
}
```
→ Backend đã hoạt động thành công! 🎉

---

## 5. Cài đặt Frontend Admin Panel

### Bước 5.1: Di chuyển vào thư mục admin-panel
```bash
cd ../admin-panel
```

### Bước 5.2: Cài đặt các gói phụ thuộc
```bash
npm install
```

### Bước 5.3: Khởi động Frontend
```bash
npm run dev
```

Frontend sẽ chạy tại:
```
http://localhost:4000
```

### Build ra sản xuất
```bash
npm run build
```
File build sẽ được xuất ra `../backend-admin/public/admin/`

---

## 6. Đăng nhập và sử dụng

### Mở trình duyệt
Truy cập: `http://localhost:4000`

### Tài khoản đăng nhập
| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| `super@dxgroup.vn` | `123456` | Super Admin |

> ⚠️ **AN TOÀN**: Hãy thay đổi mật khẩu ngay sau khi đăng nhập lần đầu!

### Các trang có thể khám phá
1. **Dashboard** - Tổng quan hoạt động
2. **Lịch hẹn** - Quản lý lịch khám
3. **Bệnh nhân** - Hồ sơ bệnh án
4. **Dịch vụ** - Các gói dịch vụ với hình ảnh
5. **Bác sĩ** - Đội ngũ y bác sĩ
6. **Kho thuốc** - Quản lý tồn kho với hình ảnh
7. **Khóa học** - Khóa học với hình ảnh + video
8. **Blogs** - Quản lý bài viết
9. **Kế toán** - Thu chi tài chính
10. **Người dùng** - Quản lý tài khoản
11. **Cài đặt** - Cấu hình hệ thống

---

## 7. Triển khai lên server

### Yêu cầu hosting
- Hỗ trợ **Node.js Selector 18+** (cPanel)
- **MySQL 8.0+** / **MariaDB 10.5+**
- **phpMyAdmin** để quản lý database
- **SSL certificate** (khuyến nghị)

### Các bước triển khai
Xem chi tiết trong file `DEPLOY.md`

Tóm tắt:
1. Upload code lên server
2. Tạo Node.js app trong cPanel
3. Tạo database và import SQL
4. Cấu hình file `.env`
5. Cấu hình `.htaccess` cho reverse proxy
6. Kiểm tra và sử dụng

---

## 8. Xử lý sự cố thường gặp

### ❌ Lỗi: Không kết nối được Database
**Nguyên nhân:** Sai thông tin đăng nhập MySQL hoặc database chưa tạo
**Giải pháp:**
- Kiểm tra lại `DB_USER`, `DB_PASSWORD`, `DB_NAME` trong file `.env`
- Đảm bảo MySQL service đang chạy
- Kiểm tra database `dxgroup_db` đã tồn tại chưa

### ❌ Lỗi: JWT_SECRET quá ngắn
**Nguyên nhân:** JWT_SECRET trong .env chưa đạt 32 ký tự
**Giải pháp:** Tạo chuỗi ngẫu nhiên dài hơn, ví dụ:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ❌ Lỗi: CORS bị chặn
**Nguyên nhân:** Frontend và Backend khác domain
**Giải pháp:** Đảm bảo `CORS_ORIGIN` trong `.env` trùng với địa chỉ frontend

### ❌ Lỗi: Port đã được sử dụng
**Nguyên nhân:** Cổng 5000 hoặc 4000 đang chạy chương trình khác
**Giải pháp:** 
- Đổi `PORT` trong file `.env`
- Hoặc kill process đang dùng cổng đó: `lsof -ti:5000 | xargs kill -9`

### ❌ Không upload được ảnh
**Nguyên nhân:** Chưa cấu hình Cloudinary hoặc thư mục upload không có quyền ghi
**Giải pháp:**
- Cấu hình Cloudinary trong `.env`
- Hoặc đảm bảo thư mục `backend-admin/public/uploads/` có quyền ghi

---

## 📞 Hỗ trợ thêm

Nếu vẫn gặp vấn đề:
1. Kiểm tra console Backend có báo lỗi gì không
2. Kiểm tra Console của trình duyệt (F12)
3. Xem lại tài liệu `backend-admin/API.md`
4. Xem `backend-admin/README.md`

---

**Chúc bạn cài đặt thành công!** 🎊

DXGroup v3.6 - Hệ thống quản lý phòng khám Đông Y hoàn chỉnh
