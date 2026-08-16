# DXGroup Frontend API Kit v3.5
Wrapper gọi API Backend cho Frontend React.

## Sử dụng
```js
import { coursesApi } from './courses';

// Trang chủ: 4 khóa nổi bật
const { data } = await coursesApi.featured();

// Trang danh sách: filter
const { data } = await coursesApi.list({ cat: 'cham-cuu', level: 'co-ban', limit: 12 });

// Trang chi tiết
const { data } = await coursesApi.getBySlug('30-huyet-cuu-song');

// Đăng ký (guest)
await coursesApi.enroll(courseId, {
  guest_name: 'Nguyễn Văn A',
  guest_phone: '090xxxxxxx',
  guest_email: 'a@gmail.com',
  payment_method: 'vnpay'  // cash | vnpay | momo | bank
});
```

## Các module khác
- `services.js` — Dịch vụ
- `doctors.js` — Bác sĩ
- `blogs.js` — Tin tức
- `appointments.js` — Đặt lịch
- `auth.js` — Đăng nhập/Đăng ký thành viên
- `payment.js` — VNPay / Momo
