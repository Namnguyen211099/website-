# DXGroup API v3.5
> Tổng **65 endpoints** · Base URL: `/api` · Auth: `Authorization: Bearer <token>`

## 🔓 PUBLIC (không cần token)
| Method | Path | Mô tả |
|---|---|---|
| GET | `/health` | Healthcheck v3.5 |
| POST | `/auth/login` | Đăng nhập → JWT |
| POST | `/auth/register` | Đăng ký thành viên (role=member) |
| GET | `/services?cat=&limit=` | Danh sách dịch vụ công khai |
| GET | `/services/:slug` | Chi tiết dịch vụ |
| GET | `/doctors?spec=&q=&limit=` | Danh sách bác sĩ |
| GET | `/doctors/:slug` | Chi tiết bác sĩ |
| GET | `/blogs?cat=&featured=1&limit=` | Tin tức (tăng view) |
| GET | `/blogs/:slug` | Chi tiết tin |
| POST | `/appointments` | Đặt lịch khách |
| GET | `/settings/group/:g` | Cài đặt nhóm |
| **⭐ V3.5 KHÓA HỌC** | | |
| GET | `/courses?cat=&level=&status=&featured=1&q=&limit=` | Danh sách khóa học |
| GET | `/courses/featured` | 4 khóa nổi bật Trang chủ |
| GET | `/courses/:slug` | Chi tiết khóa (tăng view + giáo viên + liên quan) |
| POST | `/courses/:id/register` | Đăng ký khóa (guest/member) → trả payment_code |
| 💳 **PAYMENT** | | |
| POST | `/payment/vnpay/create` | Tạo link VNPay |
| GET | `/payment/vnpay/return` | Callback VNPay → 302 → auto ghi accounting |
| POST | `/payment/momo/create` | Tạo link Momo |
| GET | `/payment/momo/return` + POST `/momo/ipn` | Callback Momo |

## 🔐 LOGIN BẮT BUỘC
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/auth/me` | ALL | Thông tin tôi |
| POST | `/auth/change-password` | ALL | Đổi mật khẩu |

## 👥 USERS (≥ ADMIN)
| GET | `/users/stats` | ≥ADMIN | Thống kê theo role |
| GET | `/users?role=&q=&status=` | ≥ADMIN | Danh sách (Admin không thấy Super) |
| POST | `/users` | ≥ADMIN | Tạo user (chỉ Super tạo Super) |
| PUT/DELETE | `/users/:id` | ≥ADMIN | Sửa/Xóa |

## 📊 KẾ TOÁN (≥ ADMIN)
| GET | `/accounting/summary?from=&to=&group=day\|week\|month` | ≥ADMIN | Tổng thu/chi/lợi nhuận + chart + top category |
| GET | `/accounting/entries?from=&to=&type=&method=&q=` | ≥ADMIN | Danh sách bút toán |
| POST | `/accounting/entries` | ≥ADMIN | Thêm bút toán thủ công |
| | | | **⭐ Auto ghi khi thanh toán khóa học `category='khoa_hoc'`** |

## 📦 KHO (≥ DƯỢC SĨ)
| GET | `/inventory/items?cat=&q=&alert=low` | ≥DƯỢC | SKU |
| POST/PUT | `/inventory/items[/:id]` | ≥DƯỢC | CRUD |
| GET | `/inventory/alerts` | ≥DƯỢC | Hết hạn 30/90 ngày + tồn thấp + tổng giá trị kho |
| GET | `/inventory/monthly` | ≥DƯỢC | Biểu đồ 12 tháng giá trị tồn |
| POST | `/inventory/inbound` | ≥DƯỢC | Nhập hàng (nhiều lô cùng lúc) |
| POST | `/inventory/outbound` | ≥DƯỢC | Xuất hàng **FIFO theo hạn dùng** |
| POST | `/inventory/stocktake` | ≥DƯỢC | Kiểm kê chênh lệch |

## 🏥 BỆNH NHÂN (≥ LỄ TÂN)
| GET | `/patients/stats` | ≥LỄ TÂN | KPI |
| GET | `/patients?q=&gender=` | ≥LỄ TÂN | Danh sách (BS chỉ xem của mình) |
| GET | `/patients/:id` | ≥LỄ TÂN | Hồ sơ + bệnh án + đơn thuốc |
| POST/PUT | `/patients[/:id]` | ≥LỄ TÂN | Tạo/sửa (auto `BN-000001`) |
| GET | `/records/patient/:pid` | ≥BS | Bệnh án |
| POST/PUT | `/records[/:id]` | ≥BS | Tạo/sửa bệnh án |
| GET | `/prescriptions/patient/:pid` | ≥BS | Đơn thuốc |
| POST | `/prescriptions` | ≥BS | Tạo đơn nháp |
| POST | `/prescriptions/:id/approve` | ≥DƯỢC | **Duyệt đơn → FIFO trừ kho tự động → auto ghi accounting `category='thuoc'`** |
| POST | `/prescriptions/:id/cancel` | ≥BS | Hủy |

## 📅 LỊCH HẸN (≥ LỄ TÂN)
| GET | `/appointments?status=&date=&q=` | ≥LỄ TÂN | Danh sách |
| GET | `/appointments/stats` | ≥LỄ TÂN | KPI |
| PATCH | `/appointments/:id/status` | ≥LỄ TÂN | Đổi trạng thái |

## 🎓⭐ V3.5 KHÓA HỌC ADMIN
| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/courses/stats` | ≥ADMIN | KPI: tổng KH / đang mở / tổng HV / doanh thu KH |
| GET | `/courses/admin/list` | ≥ADMIN | Full list |
| GET | `/courses/admin/:id` | ≥ADMIN | Chi tiết admin |
| POST | `/courses/admin` | ≥ADMIN | Tạo (auto `course_code=Kxx`, lấy `teacher_name` từ doctors) |
| PUT/DELETE | `/courses/admin/:id` | ≥ADMIN | Sửa/Xóa |
| GET | `/courses/enrollments/admin?course_id=&status=&q=` | ≥LỄ TÂN | Danh sách học viên |
| GET | `/courses/enrollments/my` | MEMBER | Khóa của tôi |
| PATCH | `/courses/enrollments/:id/status` | ≥LỄ TÂN | Đổi trạng thái: `pending→active` (auto +1 enrolled + ghi accounting `khoa_hoc`); `active→completed` (auto cấp `CERT-DX-xxx`) |
| POST | `/courses/enrollments/:id/reminder` | ≥LỄ TÂN | Gửi SMS/email nhắc khai giảng |

## 👑 CMS CRUD (≥ ADMIN)
| GET/POST/PUT/DELETE | `/services/admin/*` | ≥ADMIN | Quản lý dịch vụ |
| GET/POST/PUT/DELETE | `/doctors/admin/*` | ≥ADMIN | Quản lý bác sĩ |
| GET/POST/PUT/DELETE | `/blogs/admin/*` | ≥ADMIN | Quản lý tin tức |
| GET/POST | `/settings[/batch]` | ≥ADMIN | Cài đặt chung |
| POST | `/upload` | ≥ADMIN | Upload ảnh (Cloudinary → fallback local `/uploads/`) |
