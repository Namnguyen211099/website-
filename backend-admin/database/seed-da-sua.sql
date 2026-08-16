-- ===== USERS (DEVELOPMENT ONLY: password = 123456 bcrypt) =====
-- NEVER use these credentials in production; change/remove them before deployment.
INSERT INTO users (email,password,full_name,phone,role,status) VALUES
('super@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Super Admin','0901000000','super_admin','active'),
('admin@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Quản Trị Viên','0901000001','admin','active'),
('reception@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Lễ Tân','0901000002','reception','active'),
('pharmacist@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Dược Sĩ','0901000003','pharmacist','active'),
('doctor@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','BS. Lê Minh C','0901000004','doctor','active'),
('user@dxgroup.vn','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Nguyễn Thị Học Viên','0901000005','member','active');

-- ===== DOCTORS =====
INSERT INTO doctors (slug,full_name,title,specialty,years_exp,bio,schedule,featured) VALUES
('nguyen-van-a','PGS.TS Nguyễn Văn A','PGS.TS','Cột sống',25,'Tiến sĩ Y học cổ truyền, 25 năm kinh nghiệm','Thứ 2-4-6 · 8:00-12:00',1),
('tran-thi-b','BS. Trần Thị B','Bác sĩ II','Nội tiết Nữ',18,'Điều hòa kinh nguyệt, tiền mãn kinh','Thứ 3-5-7 · 13:30-17:30',1),
('le-minh-c','BS. Lê Minh C','Bác sĩ I','Thần kinh - Đau',12,'Chuyên gia châm cứu giảm đau','Thứ 2-6 · 14:00-20:00',1),
('pham-thi-d','Dược. Phạm Thị D','Dược sĩ','Thảo dược',10,'Quản lý kho dược, tư vấn chế biến','Thứ 2-7 · 7:00-16:00',0);

-- ===== SERVICES =====
INSERT INTO services (slug,name,category,short_desc,price,duration_min,featured) VALUES
('cham-cuu-tri-lieu','Châm cứu trị liệu','Châm cứu','Giảm đau cột sống, nửa đầu, tê bì',350000,45,1),
('thang-duoc-ca-nhan','Thang thảo dược cá nhân','Thảo dược','100+ vị thuốc theo thể trạng',450000,30,1),
('cay-chi-tu-than','Cấy chỉ tự thân','Cấy chỉ','Kích thích liên tục 7-15 ngày',800000,30,1),
('nan-chinh-cot-song','Nắn chỉnh cột sống','Cột sống','Trượt đĩa đệm, vẹo cột sống',600000,60,1),
('dien-cham-giam-beo','Điện châm giảm béo','Thẩm mỹ','Đốt mỡ bụng, đùi, cánh tay',550000,40,0),
('xong-hoi-duong-sinh','Xông hơi dưỡng sinh','Dưỡng sinh','Thải độc, lưu thông khí huyết',280000,45,0),
('hoi-chuc-nang-sinh-ly','Hồi chức năng sinh lý','Nội tiết','Cải thiện sinh lý nam nữ',750000,60,0),
('goi-kham-tong-quat','Gói khám tổng quát Đông Y','Khám','Chẩn đoán thể trạng + phác đồ 3 tháng',900000,90,1);

-- ===== BLOGS =====
INSERT INTO blogs (slug,title,category,excerpt,content,author_id,featured,status) VALUES
('5-cach-duong-gan','5 cách dưỡng gan theo Đông Y','Dinh dưỡng','Gan là tạng quan trọng, cần dưỡng đúng mùa',N'1. Ngủ trước 23h... 2. Uống nước cần tây...',2,1,'published'),
('cham-cuu-giam-dau','Châm cứu có thật sự giảm đau không?','Chuyên môn','Nghiên cứu WHO công nhận 43 bệnh chỉ định châm cứu',N'Tổ chức Y tế Thế giới...',4,1,'published'),
('thoai-hoa-cot-song','Bệnh thoái hóa cột sống: Dấu hiệu & 4 bài tập','Cột sống','Đau lưng khi ngồi lâu là dấu hiệu sớm cần lưu ý',N'4 bài tập 15 phút mỗi sáng...',3,0,'published'),
('dinh-duong-24-tiet-khi','Dinh dưỡng theo 24 tiết khí','Dinh dưỡng','Ăn theo tiết khí = dưỡng sinh đúng tự nhiên',N'Mùa Xuân ăn tăng...',2,0,'published');

-- ===== APPOINTMENTS =====
INSERT INTO appointments (code,full_name,phone,email,appt_date,appt_time,service_id,doctor_id,status,amount) VALUES
('APT-000001','Nguyễn Văn X','0903111222','x@gmail.com','2026-08-12','08:30',1,3,'confirmed',350000),
('APT-000002','Trần Thị Y','0903111333','y@gmail.com','2026-08-12','10:00',2,1,'pending',450000),
('APT-000003','Lê Văn Z','0903111444','z@gmail.com','2026-08-13','14:30',4,1,'confirmed',600000);

-- ===== SETTINGS =====
INSERT INTO settings (`group`,`key`,`value`,`type`) VALUES
('general','clinic_name','Phòng Khám Đông Y DXGroup','string'),
('general','hotline','1900 1234','string'),
('general','email','info@dxgroup.vn','string'),
('general','address','123 Nguyễn Huệ, P.Bến Nghé, Q.1, TPHCM','string'),
('general','hours_mon_sat','7:00 - 20:00','string'),
('general','hours_sun','7:00 - 12:00','string'),
('social','facebook','https://fb.com/dxgroup.vn','string'),
('social','zalo','https://zalo.me/dxgroup','string'),
('social','instagram','https://instagram.com/dxgroup.clinic','string'),
('seo','meta_title','Phòng Khám Đông Y DXGroup | Châm cứu · Thảo dược','string');

-- ===== V3.3 ACCOUNTING =====
INSERT INTO accounting_entries (entry_date,type,category,amount,method,payer_payee,note,created_by) VALUES
('2026-08-01','income','appointment',350000,'cash','Nguyễn Văn X','Khám châm cứu',2),
('2026-08-02','income','appointment',900000,'vnpay','Trần Thị Y','Gói tổng quát',2),
('2026-08-03','income','appointment',600000,'momo','Lê Văn Z','Nắn chỉnh',2),
('2026-08-04','expense','rent',25000000,'bank','Chủ nhà','Tiền thuê mặt bằng tháng 8',1),
('2026-08-05','expense','luong',85000000,'bank','Payroll','Lương nhân viên tháng 7',1),
('2026-08-06','expense','thuoc',12500000,'bank','Công ty Dược','Nhập hàng tháng',3),
('2026-08-07','income','appointment',1800000,'cash','Nhiều BN','Tổng ngày',2),
('2026-08-08','income','khoa_hoc',1290000,'vnpay','Học viên K01','Đăng ký K01',2);

-- ===== V3.4 INVENTORY =====
INSERT INTO inventory_items (sku,name,category,unit,qty,avg_cost,alert_low) VALUES
('DUO-001','Nhân sâm Hàn Quốc','Thảo dược','gam',5000,120000,500),
('DUO-002','Đương quy','Thảo dược','gam',8000,45000,300),
('DUO-003','Câu kỷ tử','Thảo dược','gam',12000,22000,500),
('DUO-004','Hoàng kỳ','Thảo dược','gam',10000,18000,400),
('DUO-005','Bạch thược','Thảo dược','gam',6000,32000,300),
('VAT-001','Kim châm vô trùng 0.25x40mm','Vật tư','hộp',200,85000,20),
('VAT-002','Băng gạc y tế 5cm','Vật tư','cuộn',150,12000,15),
('VAT-003','Chỉ cấy chỉ 3-0 PDO','Vật tư','gói',80,350000,10);

INSERT INTO inventory_batches (item_id,batch_no,qty_in,qty_remaining,unit_cost,expiry_date,inbound_date) VALUES
(1,'NS-2026-01',3000,3000,120000,'2028-06-30','2026-01-15'),
(1,'NS-2026-05',2000,2000,125000,'2028-12-31','2026-05-20'),
(2,'DQ-2026-02',8000,8000,45000,'2027-08-31','2026-02-10'),
(3,'CK-2026-03',12000,12000,22000,'2027-03-31','2026-03-05'),
(4,'HQ-2026-04',10000,10000,18000,'2027-04-30','2026-04-12'),
(5,'BT-2026-04',6000,6000,32000,'2027-05-15','2026-04-18'),
(6,'KC-2026-06',200,200,85000,'2029-01-31','2026-06-01'),
(7,'BG-2026-06',150,150,12000,'2028-09-30','2026-06-05');

INSERT INTO inventory_transactions (item_id,batch_id,tx_type,qty,unit_cost,reference_type,created_by) VALUES
(1,1,'in',3000,120000,'inbound',3),
(2,3,'in',8000,45000,'inbound',3),
(3,4,'in',12000,22000,'inbound',3),
(6,7,'in',200,85000,'inbound',3),
(6,NULL,'out',10,85000,'prescription',3);

-- ===== V3.4 PATIENTS =====
INSERT INTO patients (patient_code,full_name,gender,birth_date,phone,email,address,assigned_doctor_id) VALUES
('BN-000001','Nguyễn Văn X','male','1975-03-15','0903111222','x@gmail.com','Q.1, TPHCM',1),
('BN-000002','Trần Thị Y','female','1988-07-22','0903111333','y@gmail.com','Q.3, TPHCM',2),
('BN-000003','Lê Văn Z','male','1969-11-08','0903111444','z@gmail.com','Q.7, TPHCM',1),
('BN-000004','Phạm Thị W','female','1992-01-30','0903111555','w@gmail.com','Bình Thạnh',2);

INSERT INTO medical_records (patient_id,doctor_id,visit_date,chief_complaint,diagnosis,the_trang,treatment) VALUES
(1,1,'2026-08-05 08:30','Đau thắt lưng 3 tháng','Thoái hóa cột sống L4-L5','Lưỡi nhợt, mạch trầm','Châm cứu + nắn chỉnh + thang dược'),
(2,2,'2026-08-06 10:00','Rối loạn kinh nguyệt','Máu hư, can khí uất','Lưỡi nhợt, mạch huyền','Thang Tứ vật gia vị'),
(3,1,'2026-08-07 14:30','Vẹo cột sống cấu trúc','Chứng vẹo cột sống độ I','Lưỡi hồng, mạch bình','Nắn chỉnh 10 buổi + tập thể dục'),
(4,2,'2026-08-08 09:00','Tiền mãn kinh 45 tuổi','Can thận âm hư','Lưỡi đỏ ít rêu, mạch tế','Bổ can thận, điều hòa xung nhâm');

INSERT INTO prescriptions (patient_id,doctor_id,record_id,code,status,total_amount,approved_at) VALUES
(1,1,1,'RX-000001','approved',540000,'2026-08-05 09:15');
INSERT INTO prescription_items (prescription_id,item_id,item_name,qty,unit_price,dosage) VALUES
(1,1,'Nhân sâm',10,120000,'Sắc uống ngày 1 thang'),
(1,2,'Đương quy',15,45000,'Sắc uống ngày 1 thang'),
(1,4,'Hoàng kỳ',20,18000,'Sắc uống ngày 1 thang');

-- ============ V3.5 COURSES (MỚI) ============
INSERT INTO courses (course_code,slug,title,category,level,short_desc,description,teacher_id,teacher_name,total_videos,total_hours,price_original,price_sale,enrolled_count,status,featured_home,best_seller,tags,views) VALUES
('K01','30-huyet-cuu-song','K01 · 30 huyệt châm cứu cứu sống tại nhà','cham-cuu','co-ban','Tìm đúng 30 huyệt vàng, xử lý 15 bệnh thông thường','Khóa học thực hành 100%: học viên tự tìm huyệt trên người mình, BS trực tiếp sửa lỗi qua video call.',1,'PGS.TS Nguyễn Văn A',24,12.3,1990000,1290000,482,'open',1,1,'["cham-cuu","co-ban","huyet-vang"]',3250),
('K02','che-bien-50-vi-thuoc','K02 · Chế biến 50 vị thuốc gia đình','thao-duoc','co-ban','Sắc thuốc đúng lửa, ngâm rượu, nấu cháo dưỡng sinh an toàn','Học từ cơ bản: phân biệt thật giả, độ tươi, các phương pháp chế biến sao, ngâm, hấp, nấu.',4,'Dược. Phạm Thị D',18,9.0,1200000,990000,216,'open',1,0,'["thao-duoc","nau-thuoc","gia-dinh"]',1820),
('K03','massage-cuu-chua-dau-lung','K03 · Massage & xoa bóp cứu chữa đau lưng','cot-song','trung-cap','12 động tác chuẩn y khoa, giảm thoái hóa L1-L5','Khóa học dành cho người ngồi nhiều, đau vai gáy, thoái hóa cột sống mãn tính.',3,'BS. Lê Minh C',32,15.0,1990000,1590000,358,'open',1,0,'["cot-song","massage","dau-lung"]',2410),
('K04','chan-doan-luoi-mach','K04 · Chẩn đoán lưỡi & mạch chuyên sâu','chan-doan','nang-cao','Đọc 7 dạng lưỡi, 28 vị mạch — biết bệnh trước triệu chứng','Khóa nâng cao chỉ dành cho người đã qua K01/K02 hoặc có nền tảng YHCT.',1,'PGS.TS Nguyễn Văn A',40,18.0,2990000,2490000,42,'opening_soon',1,0,'["chan-doan","luoi","mach","nang-cao"]',980),
('K05','duong-sinh-8-phuong','K05 · Dưỡng sinh 8 phương Tàu Đặng','duong-sinh','co-ban','Tập 8 động tác mỗi sáng 15 phút, lưu thông 12 kinh lạc','Phương pháp dưỡng sinh cổ truyền, phù hợp mọi lứa tuổi, đặc biệt trung niên.',2,'BS. Trần Thị B',16,8.0,990000,790000,128,'open',0,0,'["duong-sinh","tau-dang","tap-the"]',650),
('K06','dieu-hoa-noi-tiet-nu','K06 · Điều hòa nội tiết nữ bằng thảo dược','noi-tiet','trung-cap','Kinh nguyệt, mãn kinh, giảm cân theo thể trạng Vương/Thổ/Hỏa','Toàn bộ kiến thức BS. Trần Thị B 18 năm điều trị phụ khoa Đông Y.',2,'BS. Trần Thị B',28,14.0,2200000,1890000,22,'opening_soon',0,0,'["noi-tiet","phu-khoa","thao-duoc"]',420);

-- ===== V3.5 ENROLLMENTS =====
INSERT INTO course_enrollments (course_id,user_id,guest_name,guest_phone,guest_email,amount_paid,payment_method,payment_status,status,progress_pct) VALUES
(1,6,'Nguyễn Thị Học Viên','0901000005','user@dxgroup.vn',1290000,'vnpay','paid','active',35),
(1,NULL,'Nguyễn Văn A1','0908111001','a1@gmail.com',1290000,'momo','paid','active',12),
(1,NULL,'Trần Thị B1','0908111002','b1@gmail.com',1290000,'cash','paid','active',58),
(2,NULL,'Lê Văn C1','0908111003','c1@gmail.com',990000,'bank','paid','pending',0),
(4,NULL,'Phạm Thị D1','0908111004','d1@gmail.com',500000,'cash','unpaid','pending',0);
