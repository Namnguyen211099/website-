# DXGroup v3.6 - Cập nhật tính năng mới

## 🆕 Tính năng mới trong v3.6

### 1. 🖼️ Hình ảnh minh họa cho Dịch vụ
- Mỗi gói dịch vụ có thể thêm hình ảnh minh họa
- Trường `image` trong bảng `services`
- Hiển thị ảnh trên trang quản lý và trang khách hàng

### 2. 🖼️ Hình ảnh sản phẩm cho Kho thuốc
- Mỗi sản phẩm kho thuốc có thể thêm hình ảnh
- Trường `image` trong bảng `inventory_items`
- Hiển thị ảnh trong danh sách và chi tiết sản phẩm
- Thêm vào form thêm/sửa sản phẩm

### 3. 🎬 Video giới thiệu cho Khóa học
- Thêm link video giới thiệu (YouTube, Vimeo,...)
- Trường `video_url` và `has_video` trong bảng `courses`
- Nút xem video ngay trên giao diện
- Badge "Có video" hiển thị trên thẻ khóa học

### 4. 📝 Cập nhật giao diện Admin Panel
- **Services.jsx**: Đã hỗ trợ trường `image` từ trước
- **Inventory.jsx**: Thêm cột ảnh và ô nhập URL ảnh
- **Courses.jsx**: Thêm ô nhập URL video và checkbox "Có video"

---

## 🗃️ File Migration

Để nâng cấp từ v3.5 lên v3.6, chạy file SQL:
```
backend-admin/database/migration-v3.5-to-v3.6.sql
```

File này sẽ:
1. Thêm cột `image` vào bảng `inventory_items`
2. Thêm cột `video_url` và `has_video` vào bảng `courses`
3. Cập nhật dữ liệu mẫu có sẵn

---

## 🚀 Cách sử dụng tính năng mới

### Thêm hình ảnh cho sản phẩm Kho thuốc
1. Vào trang **Kho dược**
2. Trong form "Thêm mới", có ô **URL Ảnh**
3. Dán link ảnh vào ô đó và lưu
4. Ảnh sẽ hiển thị trong cột đầu tiên của bảng

### Thêm video cho Khóa học
1. Vào trang **Quản lý Khóa học**
2. Thêm mới hoặc Sửa khóa học
3. Có ô **URL Video giới thiệu (YouTube)**
4. Dán link YouTube vào ô đó
5. Tự động tick vào "Có video giới thiệu"
6. Lưu lại là xong

---

## 📋 Tổng kết

DXGroup v3.6 tập trung nâng cao trải nghiệm trực quan:
- ✅ Hình ảnh minh họa dịch vụ
- ✅ Hình ảnh sản phẩm kho thuốc
- ✅ Video giới thiệu khóa học
- ✅ Giao diện quản lý thân thiện hơn
- ✅ Tương thích ngược với v3.5

---

**DXGroup v3.6** - Trải nghiệm trực quan hơn cho phòng khám Đông Y
