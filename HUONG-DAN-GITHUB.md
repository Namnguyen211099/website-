# Hướng dẫn đẩy dự án DXGroup lên GitHub

## 📋 Chuẩn bị

### 1. Tạo tài khoản GitHub
- Truy cập: https://github.com
- Đăng ký tài khoản miễn phí (nếu chưa có)

### 2. Cài đặt Git
- Tải Git: https://git-scm.com/downloads
- Cài đặt theo hướng dẫn (chỉ cần nhấn Next → Next → Finish)
- Kiểm tra: Mở CMD / Terminal, gõ `git --version` → thấy phiên bản là OK

---

## 🚀 Bước 1: Tạo Repository mới trên GitHub

1. Đăng nhập GitHub → Nhấn dấu **+** góc trên bên phải → **New repository**
2. Điền thông tin:
   - **Repository name**: `dxgroup-clinic` (hoặc tên bạn muốn)
   - **Description**: DXGroup - He thong quan ly phong kham Dong Y
   - Chọn **Public** (mọi người xem được) hoặc **Private** (chỉ bạn xem được)
   - **KHÔNG tick** "Add a README file", "Add .gitignore", "Choose a license"
3. Nhấn **Create repository**

---

## 📂 Bước 2: Đẩy code lên GitHub

Mở CMD / Terminal, di chuyển vào thư mục dự án của bạn:

```bash
# Di chuyen vao thu muc giai nen
cd D:\DXGroup\DXGroup-FullStack-v3.6

# Khoi tao Git
git init

# Them tat ca file
git add .

# Tao commit dau tien
git commit -m "Khoi tao du an DXGroup v3.6 - Full Stack hoan chinh"

# Ket noi voi GitHub repository
# Thay YOUR_USERNAME va YOUR_REPO bang ten cua ban
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Day code len GitHub
git branch -M main
git push -u origin main
```

**Ví dụ:**
Nếu GitHub của bạn là `https://github.com/nguyenvana/dxgroup-clinic` thì lệnh là:
```bash
git remote add origin https://github.com/nguyenvana/dxgroup-clinic.git
git branch -M main
git push -u origin main
```

---

## 🔄 Bước 3: Cập nhật code sau này

Khi bạn sửa code và muốn đẩy lên GitHub:

```bash
# Xem nhung thay doi
git status

# Them tat ca thay doi
git add .

# Tao commit voi thong diep
git commit -m "Sua giao dien trang chu, them hinh anh moi"

# Day len GitHub
git push
```

---

## 📦 Cấu trúc thư mục trên GitHub

Sau khi đẩy xong, trên GitHub của bạn sẽ có cấu trúc:

```
dxgroup-clinic/
├── admin-panel/              # React Admin Panel
├── backend-admin/            # Node.js Backend API
├── frontend-api-kit/         # API toolkit
├── frontend-website/         # Frontend HTML thuan
├── frontend-website-react/   # ⭐ Frontend React (da tich hop API)
├── README.md                 # Tong quan du an
├── HUONG-DAN-CAI-DAT.md      # Huong dan cai dat
├── PHIEN-BAN-v3.6.md         # Thong tin phien ban
└── DEPLOY.md                 # Huong dan trien khai
```

---

## 🌐 Triển khai miễn phí trên Vercel (khuyến nghị)

Bạn có thể đưa website lên internet miễn phí bằng Vercel:

### Triển khai Frontend React:
1. Truy cập: https://vercel.com
2. Đăng nhập bằng tài khoản GitHub
3. Nhấn **Add New Project** → Chọn repository `dxgroup-clinic` của bạn
4. Trong phần **Configure Project**:
   - **Framework Preset**: Chọn **Vite**
   - **Root Directory**: Chọn **`frontend-website-react`**
   - Nhấn **Deploy**
5. Sau vài phút, bạn sẽ có đường dẫn: `https://dxgroup-xxx.vercel.app`

### Triển khai Backend:
- Sử dụng: **Render.com**, **Railway.app**, hoặc VPS có Node.js
- Xem chi tiết trong file `DEPLOY.md`

---

## 💡 Lưu ý quan trọng

### ❌ KHÔNG đẩy file .env lên GitHub!
File `.env` chứa mật khẩu database, khóa bí mật... File `.gitignore` đã được cấu hình để tự động bỏ qua các file này.

### ✅ Nên đẩy file `.env.example`
Đây là file mẫu, không chứa mật khẩu thật, giúp người khác biết cần cấu hình những gì.

### 📝 Mô tả commit rõ ràng
Viết commit message dễ hiểu, ví dụ:
- ✅ `git commit -m "Them trang dat lich moi"`
- ✅ `git commit -m "Sua loi goi API dich vu"`
- ❌ `git commit -m "sua code"`

---

## 🆘 Xử lý lỗi thường gặp

### Lỗi: "fatal: remote origin already exists"
**Giải pháp:** Xóa remote cũ rồi thêm lại:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Lỗi: "Authentication failed"
**Giải pháp:** Tạo Personal Access Token trên GitHub và dùng làm mật khẩu khi đăng nhập.

### Lỗi: Push bị từ chối
**Giải pháp:** Lấy code mới nhất về trước:
```bash
git pull origin main
git push origin main
```

---

## 📚 Tài liệu tham khảo

- Học Git cơ bản: https://www.w3schools.com/git/
- GitHub Docs: https://docs.github.com
- Vercel Deploy: https://vercel.com/docs

---

**Chúc bạn thành công!** 🎉
