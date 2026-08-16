# DXGroup - Hệ thống quản lý phòng khám Đông Y

**Phiên bản:** v3.6 (Full Stack Hoàn chỉnh)

## 📋 Giới thiệu

DXGroup là hệ thống quản lý phòng khám Đông Y toàn diện, được xây dựng với công nghệ hiện đại. Hệ thống bao gồm đầy đủ các chức năng quản lý bệnh nhân, lịch hẹn, dịch vụ, bác sĩ, kho thuốc, khóa học, kế toán và cài đặt hệ thống.

## 🏗️ Công nghệ sử dụng

### Backend
- **Node.js 18+** - Môi trường chạy JavaScript
- **Express.js** - Framework web
- **MySQL 8.0+ / MariaDB 10.5+** - Cơ sở dữ liệu
- **JWT** - Xác thực người dùng
- **bcryptjs** - Mã hóa mật khẩu
- **Multer** - Xử lý upload file
- **Cloudinary** - Lưu trữ hình ảnh
- **Nodemailer** - Gửi email
- **node-cron** - Tác vụ định kỳ

### Frontend (Admin Panel)
- **React 18** - Thư viện giao diện
- **Vite 5** - Công cụ build
- **React Router 6** - Định tuyến
- **Tailwind CSS** - Framework CSS
- **Axios** - Gọi API
- **React Toastify** - Thông báo

### Database
- **MySQL 8.0+** / **MariaDB 10.5+**
- 20+ bảng dữ liệu được thiết kế chuyên nghiệp

## 📦 Cấu trúc thư mục

```
DXGroup-FullStack-v3.6/
├── admin-panel/          # Giao diện quản trị (React)
│   ├── src/
│   │   ├── components/   # Component tái sử dụng
│   │   ├── pages/        # 13 trang quản lý
│   │   ├── context/      # Context xác thực
│   │   ├── api/          # API client
│   │   └── ...
│   └── package.json
│
├── backend-admin/        # Backend API (Node.js + Express)
│   ├── config/           # Cấu hình (DB, env)
│   ├── controllers/      # 15 controller xử lý logic
│   ├── middleware/       # Middleware (auth, rate limit)
│   ├── routes/           # 15 file định tuyến API
│   ├── models/           # Mô hình dữ liệu
│   ├── database/         # SQL schema + seed + migration
│   ├── cron/             # Tác vụ định kỳ
│   ├── scripts/          # Script khởi tạo DB
│   ├── public/           # File tĩnh + upload
│   ├── server.js         # File khởi động server
│   ├── API.md            # Tài liệu 65 API endpoints
│   ├── README.md         # Hướng dẫn backend
│   └── package.json
│
├── frontend-website/     # Trang web cong khai (HTML/CSS/JS thuan - mo file la chay)
│   ├── index.html        # Trang web hoan chinh 1 file
│   └── README.md         # Huong dan
│
├── frontend-website-react/ # ⭐ TRANG WEB CONG KHAI BANG REACT (de chinh sua sau nay)
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Card, Form...
│   │   ├── pages/        # Home, Services, Doctors, Courses, Booking, Contact
│   │   ├── data/         # Du lieu mau
│   │   ├── App.jsx       # Routing
│   │   └── main.jsx      # Diem vao
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md         # Huong dan chi tiet
│
├── frontend-api-kit/     # Bo cong cu API cho frontend
│   ├── src/api/          # Các module API đóng gói
│   ├── src/hooks/        # Custom hooks
│   └── README.md
│
├── DEPLOY.md             # Hướng dẫn triển khai
├── README.md             # File này
└── HUONG-DAN-CAI-DAT.md  # Hướng dẫn cài đặt chi tiết
```

## ✨ Tính năng chính

### 1. Dashboard
- Thống kê tổng quan
- Biểu đồ doanh thu
- Lịch hẹn gần đây
- Cảnh báo hệ thống

### 2. Quản lý Lịch hẹn
- Tạo/xác nhận/hủy lịch hẹn
- Chuyển đổi trạng thái
- Lọc và tìm kiếm

### 3. Quản lý Bệnh nhân
- Hồ sơ bệnh án đầy đủ
- Lịch sử khám bệnh
- Thông tin liên hệ

### 4. Quản lý Dịch vụ 🖼️
- Các gói dịch vụ với hình ảnh minh họa
- Giá cả và thời lượng
- Nhãn phân loại

### 5. Quản lý Bác sĩ
- Thông tin chuyên môn
- Kinh nghiệm và bằng cấp
- Lịch làm việc

### 6. Quản lý Kho thuốc 🖼️
- Sản phẩm với hình ảnh
- Theo dõi tồn kho
- Cảnh báo hết hạn, tồn thấp
- FIFO xuất kho

### 7. Quản lý Khóa học 🎬
- Khóa học với hình ảnh banner
- Video giới thiệu (YouTube)
- Quản lý học viên
- Chứng chỉ hoàn thành

### 8. Quản lý Blogs
- Bài viết chia sẻ kiến thức
- Chuyên mục phân loại
- Trạng thái đăng/nháp

### 9. Kế toán
- Thu/chi tài chính
- Biểu đồ theo dõi
- Xuất báo cáo

### 10. Quản lý Người dùng
- Phân quyền theo vai trò
- Trạng thái tài khoản

### 11. Cài đặt hệ thống
- Thông tin phòng khám
- Tích hợp thanh toán (VNPay, MoMo)
- Tích hợp email, lưu trữ ảnh

## 🔐 Hệ thống phân quyền

| Vai trò | Quyền hạn |
|--------|----------|
| **Super** | Toàn quyền cao nhất |
| **Admin** | Truy cập tất cả chức năng |
| **Reception** | Dashboard, Lịch hẹn, Bệnh nhân, Đăng ký |
| **Pharmacist** | Quản lý Kho thuốc |
| **Member** | Quyền cơ bản |

## 🚀 Bắt đầu nhanh

Xem file **HUONG-DAN-CAI-DAT.md** để biết hướng dẫn cài đặt chi tiết.

### Yêu cầu hệ thống
- Node.js 18+ (khuyến nghị 20)
- MySQL 8.0+ / MariaDB 10.5+
- npm hoặc yarn

### Cài đặt nhanh

```bash
# 1. Cài đặt Backend
cd backend-admin
npm install
cp .env.example .env
# Sửa file .env với cấu hình database của bạn

# 2. Khởi tạo Database
# Import database/schema.sql vào MySQL
# Import database/seed.sql để có dữ liệu mẫu

# 3. Khởi động Backend
npm run dev

# 4. Cài đặt Frontend (Admin Panel)
cd ../admin-panel
npm install
npm run dev

# 5. Truy cập
# Backend API: http://localhost:5000
# Admin Panel: http://localhost:4000
```

### Tài khoản đăng nhập mẫu
- **Email:** `super@dxgroup.vn`
- **Mật khẩu:** `123456`

> ⚠️ **Lưu ý:** Đây chỉ là tài khoản phát triển, hãy thay đổi ngay khi triển khai sản xuất.

## 📚 Tài liệu API

Xem file `backend-admin/API.md` để biết chi tiết 65 API endpoints.

### Các API chính
- `GET /api/health` - Kiểm tra trạng thái
- `POST /api/auth/login` - Đăng nhập
- `GET /api/services` - Danh sách dịch vụ
- `GET /api/doctors` - Danh sách bác sĩ
- `GET /api/courses` - Danh sách khóa học
- `POST /api/appointments` - Đặt lịch hẹn
- ... và 60+ endpoints khác

## 🛡️ Bảo mật

- Cookie HttpOnly cho xác thực
- Mã hóa mật khẩu bcrypt
- CORS whitelist
- Rate limiting
- Xác thực chữ ký thanh toán
- Upload file an toàn
- JWT secret tối thiểu 32 ký tự

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy xem:
1. `HUONG-DAN-CAI-DAT.md` - Hướng dẫn cài đặt
2. `backend-admin/README.md` - Tài liệu backend
3. `DEPLOY.md` - Hướng dẫn triển khai lên server

---

**DXGroup v3.6** - Hệ thống quản lý phòng khám Đông Y hoàn chỉnh
