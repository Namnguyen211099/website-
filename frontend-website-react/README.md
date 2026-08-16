# DXGroup Frontend Website (React)

Trang web công khai cho khách hàng truy cập, được xây dựng bằng **React + Vite + Tailwind CSS**.

## ✅ ĐÃ TÍCH HỢP SẴN API BACKEND

Dự án này **đã được tích hợp sẵn** gọi API đến backend Node.js:

- **Trang chủ**: Lấy dịch vụ, bác sĩ, khóa học nổi bật từ API
- **Trang Dịch vụ**: Lấy danh sách dịch vụ từ `/api/services`
- **Trang Bác sĩ**: Lấy danh sách bác sĩ từ `/api/doctors`
- **Trang Khóa học**: Lấy danh sách khóa học từ `/api/courses`
- **Form Đặt lịch**: Gửi POST đến `/api/appointments`
- **Vite Proxy**: Đã cấu hình proxy `/api` → `http://localhost:5000` (tránh lỗi CORS)

### 🎯 Cách hoạt động thông minh:
- ✅ **Nếu Backend đang chạy** → Lấy dữ liệu thật từ database
- ✅ **Nếu Backend chưa chạy** → Tự động dùng **dữ liệu mẫu** để vẫn xem được giao diện
- Không bao giờ bị trang trắng hay lỗi 404!

## 🛠️ Công nghệ sử dụng

- **React 18** - Thư viện giao diện
- **Vite 5** - Công cụ build & dev server
- **React Router 6** - Định tuyến trang
- **Tailwind CSS 3** - Framework CSS
- **Nunito Font** - Font chữ

## 📂 Cấu trúc thư mục

```
frontend-website-react/
├── index.html              # File HTML gốc
├── package.json            # Thông tin dự án & dependencies
├── vite.config.js          # Cấu hình Vite
├── tailwind.config.js      # Cấu hình Tailwind
├── postcss.config.js       # Cấu hình PostCSS
└── src/
    ├── main.jsx            # Điểm vào React
    ├── App.jsx             # Component chính + Routing
    ├── index.css           # Styles + Tailwind directives
    ├── components/         # Component tái sử dụng
    │   ├── Navbar.jsx      # Thanh điều hướng
    │   ├── Footer.jsx      # Chân trang
    │   ├── Hero.jsx        # Banner trang chủ
    │   ├── Features.jsx    # Đặc điểm nổi bật
    │   ├── ServiceCard.jsx # Card dịch vụ
    │   ├── DoctorCard.jsx  # Card bác sĩ
    │   ├── CourseCard.jsx  # Card khóa học
    │   ├── BookingForm.jsx # Form đặt lịch
    │   └── PageHeader.jsx  # Header các trang con
    ├── pages/              # Các trang chính
    │   ├── Home.jsx        # Trang chủ
    │   ├── Services.jsx    # Trang dịch vụ
    │   ├── Doctors.jsx     # Trang bác sĩ
    │   ├── Courses.jsx     # Trang khóa học
    │   ├── Booking.jsx     # Trang đặt lịch
    │   └── Contact.jsx     # Trang liên hệ
    └── data/
        └── content.js      # Dữ liệu mẫu (dịch vụ, bác sĩ, khóa học)
```

## 🚀 Cách chạy

### 1. Cài đặt dependencies
```bash
cd frontend-website-react
npm install
```

### 2. Chạy môi trường phát triển
```bash
npm run dev
```
- Mở trình duyệt: `http://localhost:3000`
- Tính năng tự động reload khi sửa code

### 3. Build ra sản xuất
```bash
npm run build
```
- File build được xuất ra thư mục `dist/`
- Upload thư mục `dist/` lên hosting là chạy được

### 4. Xem trước bản build
```bash
npm run preview
```

## 🎯 Các trang có sẵn

| Route | Trang | Mô tả |
|-------|------|-------|
| `/` | Trang chủ | Hero, dịch vụ nổi bật, bác sĩ, khóa học, form đặt lịch nhanh |
| `/services` | Dịch vụ | Tất cả các gói dịch vụ kèm hình ảnh |
| `/doctors` | Bác sĩ | Đội ngũ chuyên môn |
| `/courses` | Khóa học | Khóa học, video giới thiệu, đăng ký |
| `/booking` | Đặt lịch | Form đặt lịch chi tiết |
| `/contact` | Liên hệ | Thông tin + form gửi yêu cầu |

## ✨ Cách chỉnh sửa dễ dàng

### Thêm/Sửa dịch vụ
Mở file: `src/data/content.js` → chỉnh sửa mảng `servicesData`

### Thêm/Sửa bác sĩ
Mở file: `src/data/content.js` → chỉnh sửa mảng `doctorsData`

### Thêm/Sửa khóa học
Mở file: `src/data/content.js` → chỉnh sửa mảng `coursesData`

### Sửa màu sắc chủ đạo
Mở file: `tailwind.config.js` → chỉnh sửa phần `colors.primary`

### Thêm trang mới
1. Tạo file trong `src/pages/TenTrangMoi.jsx`
2. Mở `src/App.jsx` → thêm route mới:
   ```jsx
   import TenTrangMoi from './pages/TenTrangMoi'
   // ...
   <Route path="/duong-dan" element={<TenTrangMoi />} />
   ```
3. Mở `src/components/Navbar.jsx` → thêm link vào menu

## 🔗 Tích hợp với Backend API

Để lấy dữ liệu thật từ backend thay vì dữ liệu mẫu:

### Ví dụ lấy dịch vụ từ API:
```jsx
// src/pages/Services.jsx
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Lỗi:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-10 text-center">Dang tai...</div>

  return (
    <div className="page-animate">
      <PageHeader title="Dich vu" subtitle="Cac goi dich vu tai DXGroup" />
      <section className="py-[70px]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Ví dụ gửi form đặt lịch lên API:
Trong `src/components/BookingForm.jsx`, thay thế hàm `handleSubmit`:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  
  try {
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); e.target.reset() }, 3000)
  } catch (err) {
    alert('Co loi xay ra, vui long thu lai')
  }
}
```

## 📦 Deploy lên hosting

### Cách 1: Upload thư mục dist/
1. Chạy `npm run build`
2. Upload toàn bộ nội dung thư mục `dist/` lên hosting (cPanel, Netlify, Vercel, GitHub Pages...)

### Cách 2: Triển khai cùng Backend
- Build frontend: `npm run build`
- Copy thư mục `dist/` vào `backend-admin/public/`
- Đặt tên thư mục là `website` hoặc cấu hình Express serve static files

---

**DXGroup Frontend React** - Dễ dàng chỉnh sửa, mở rộng và tùy chỉnh!
