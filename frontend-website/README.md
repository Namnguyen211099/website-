# Frontend Website - DXGroup

Trang web công khai cho khách hàng truy cập, xem thông tin, đặt lịch hẹn và đăng ký khóa học.

## 📋 Nội dung trang web

### Các trang chính:
1. **Trang chủ** - Giới thiệu phòng khám, dịch vụ nổi bật, bác sĩ, khóa học, form đặt lịch nhanh
2. **Dịch vụ** - Danh sách tất cả các gói dịch vụ kèm hình ảnh và giá cả
3. **Bác sĩ** - Thông tin đội ngũ y bác sĩ chuyên môn
4. **Khóa học** - Các khóa học chia sẻ kiến thức, có video giới thiệu
5. **Đặt lịch** - Form đặt lịch hẹn chi tiết
6. **Liên hệ** - Thông tin liên hệ và form gửi yêu cầu

## 🎨 Đặc điểm kỹ thuật

- **HTML5** - Cấu trúc trang
- **CSS3** - Giao diện và responsive
- **Vanilla JavaScript** - Tương tác và logic
- **Google Fonts (Nunito)** - Font chữ
- **Không cần framework** - Chạy được ngay trên mọi trình duyệt

## 🚀 Cách chạy

### Cách 1: Mở trực tiếp
Mở file `index.html` bằng trình duyệt web là chạy được ngay.

### Cách 2: Chạy qua server (khuyến nghị)
```bash
# Cách 1: Dùng Python
python3 -m http.server 8080

# Cách 2: Dùng Node.js (nếu có serve)
npx serve .

# Mở trình duyệt: http://localhost:8080
```

## 📱 Responsive

Trang web được thiết kế responsive, hiển thị tốt trên:
- 💻 Máy tính (Desktop)
- 📱 Điện thoại di động (Mobile)
- 📱 Máy tính bảng (Tablet)

## 🎯 Tính năng

✅ Xem giới thiệu phòng khám  
✅ Xem danh sách dịch vụ kèm hình ảnh  
✅ Xem thông tin đội ngũ bác sĩ  
✅ Xem khóa học, video giới thiệu  
✅ Đặt lịch hẹn trực tuyến (form)  
✅ Gửi yêu cầu liên hệ (form)  
✅ Điều hướng đơn giản, dễ sử dụng  

## 🔗 Tích hợp với Backend

Để kết nối với backend thật (gửi form, lấy dữ liệu động):

1. Thay thế dữ liệu mẫu trong `<script>` bằng API call:
```javascript
// Ví dụ lấy dịch vụ từ API
fetch('/api/services')
  .then(res => res.json())
  .then(data => { servicesData = data.data; renderServices('all-services'); });
```

2. Xử lý submit form gửi lên API:
```javascript
function submitQuickBooking(e){
  e.preventDefault();
  fetch('/api/appointments', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
  }).then(...);
}
```

## 📂 Cấu trúc file

```
frontend-website/
└── index.html    # File chính chứa toàn bộ trang web
```

> Lưu ý: Toàn bộ HTML, CSS, JavaScript được gộp trong một file để dễ dàng triển khai. Nếu cần, có thể tách ra thành các file riêng (index.html, style.css, app.js).

---

**DXGroup Frontend Website** - Trải nghiệm người dùng tuyệt vời cho khách hàng phòng khám Đông Y
