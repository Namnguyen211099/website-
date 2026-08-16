# Frontend API Integration Kit · DXGroup v3.2

> **Copy toàn bộ thư mục `src/` này vào `frontend/src/` của bạn**
> Thay thế **toàn bộ dữ liệu cứng / localStorage** bằng gọi API thật

---

## 📁 Cấu trúc

```
src/
├── api/
│   ├── client.js          Axios base + JWT interceptor
│   ├── services.js        6 hàm dịch vụ
│   ├── doctors.js         5 hàm bác sĩ
│   ├── blogs.js           8 hàm tin tức + nổi bật
│   ├── appointments.js    6 hàm đặt lịch + VNPay + Momo + Upload
│   └── settings.js        3 hàm cài đặt chung
└── hooks/
    └── useData.js         Custom hook tải dữ liệu (loading/error/refetch)
```

---

## 🚀 Bước 1: Cấu hình Vite Proxy (DEV)

Thêm vào `frontend/vite.config.js`:
```js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'   // ← gọi backend-admin
    }
  }
});
```

**PROD** (trên cPanel): Frontend build vào `public_html/` → gọi `/api/...` → Node.js App `backend-admin` đã ở URL `/api` → **không cần gì thêm** ✅

---

## 🚀 Bước 2: Sử dụng trong Component

### Ví dụ 1: Trang Dịch vụ (Public)
```jsx
import { getAllServices } from '@/api/services';
import useData from '@/hooks/useData';

export default function ServicesPage() {
  const [cat, setCat] = useState('all');
  const { data, loading } = useData(() => getAllServices({ cat }), [cat]);

  if (loading) return <div>Đang tải...</div>;
  return <div>{data.data.map(s => <ServiceCard key={s.id} s={s} />)}</div>;
}
```

### Ví dụ 2: Trang Chủ → 3 bài nổi bật
```jsx
import { getBlogFeatured } from '@/api/blogs';
const { data } = useData(getBlogFeatured, []);
```

### Ví dụ 3: Header/Footer → Thông tin phòng khám
```jsx
import { getAllSettings } from '@/api/settings';
const { data } = useData(getAllSettings, []);
// data = { general: { clinicName, hotline, address, hours, about }, brand: {...} }
```

### Ví dụ 4: Form đặt lịch
```jsx
import { createAppointment, createVNPayPayment } from '@/api/appointments';
import { toast } from 'react-toastify';

const submit = async e => {
  e.preventDefault();
  // Bước 1: tạo lịch
  const apt = await createAppointment(formData);

  // Bước 2: nếu thanh toán VNPay
  if (formData.payment === 'vnpay') {
    const pay = await createVNPayPayment(apt.id, formData.total_amount);
    window.location.href = pay.payment_url; // ← chuyển sang VNPay
  } else {
    toast.success(`Đặt lịch thành công · Mã: ${apt.code}`);
    navigate('/dat-lich-thanh-cong?code=' + apt.code);
  }
};
```

### Ví dụ 5: Upload ảnh (Admin)
```jsx
import { uploadImage } from '@/api/appointments';

const handleFile = async e => {
  const file = e.target.files[0];
  const r = await uploadImage(file);
  console.log('URL ảnh:', r.url); // ← lưu vào CSDL
};
```

---

## 🔑 Tóm tắt tất cả hàm API

| Module | Hàm | Quyền |
|---|---|---|
| **services** | `getAllServices({cat,sort,limit})` | Public |
| | `getServiceBySlug(slug)` | Public |
| | `getAllServicesAdmin()` | Admin |
| | `createService / updateService / deleteService` | Admin |
| **doctors** | `getAllDoctors({spec,q,sort})` | Public |
| | CRUD | Admin |
| **blogs** | `getAllBlogs / getBlogFeatured / getBlogBySlug` | Public |
| | CRUD + `setFeaturedBlog(id)` | Admin |
| **appointments** | `createAppointment` | Public |
| | `getAppointments / stats / updateStatus / update / delete` | Admin |
| | `createVNPayPayment(id, amount)` | Public |
| | `createMomoPayment(id, amount)` | Public |
| | `uploadImage(file) / uploadMultiple([files])` | Admin |
| **settings** | `getAllSettings / getSettingsGroup(group)` | Public |
| | `saveSettings(group, values)` | Admin |

---

## ✅ Chuyển từ localStorage → API thật (nhanh)

1. Xóa toàn bộ `useState` khởi tạo dữ liệu cứng
2. Thay bằng `const { data, loading } = useData(() => fn(), [])`
3. Thêm điều kiện `if (loading) return <Skeleton />`
4. Dùng `data?.data?.map(...)` (optional chaining)

---

## 🆘 Lỗi thường gặp

| Lỗi | Nguyên nhân | Sửa |
|-----|-------------|-----|
| `401 Unauthorized` | Upload ảnh / CRUD admin cần token | Đăng nhập trước |
| `Network Error` (DEV) | Backend chưa chạy | `cd backend-admin && npm run dev` |
| `CORS` | Domain không trong `.env CORS_ORIGIN` | Thêm domain vào danh sách |
| `500 Multer` | File > 5MB | Nén ảnh trước khi upload |
