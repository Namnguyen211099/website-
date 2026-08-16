-- ============================================================
-- DXGroup Migration: v3.4 → v3.5
-- Chạy file này trên database v3.4 đã có dữ liệu = thêm Khóa học
-- KHÔNG MẤT DỮ LIỆU CŨ
-- ============================================================
USE dxgroup;

-- ===== V3.5: 2 BẢNG MỚI =====
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_code VARCHAR(16) UNIQUE NOT NULL,
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(60),
  level ENUM('co-ban','trung-cap','nang-cao') DEFAULT 'co-ban',
  short_desc VARCHAR(255),
  description TEXT,
  curriculum JSON,
  thumbnail VARCHAR(500),
  video_intro VARCHAR(500),
  teacher_id INT NULL,
  teacher_name VARCHAR(100),
  total_videos INT DEFAULT 0,
  total_hours DECIMAL(5,1) DEFAULT 0,
  start_date DATE NULL,
  price_original DECIMAL(12,2) NOT NULL DEFAULT 0,
  price_sale DECIMAL(12,2) NOT NULL DEFAULT 0,
  max_students INT DEFAULT 0,
  enrolled_count INT DEFAULT 0,
  status ENUM('draft','open','opening_soon','closed') DEFAULT 'draft',
  featured_home TINYINT DEFAULT 0,
  best_seller TINYINT DEFAULT 0,
  has_certificate TINYINT DEFAULT 1,
  allow_reviews TINYINT DEFAULT 1,
  tags JSON,
  views INT DEFAULT 0,
  meta_title VARCHAR(160),
  meta_desc VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_by INT NULL,
  published_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_status (status), INDEX idx_featured (featured_home)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS course_enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_email VARCHAR(100),
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(30) DEFAULT 'cash',
  payment_code VARCHAR(100),
  payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
  status ENUM('pending','active','completed','cancelled') DEFAULT 'pending',
  progress_pct TINYINT DEFAULT 0,
  certificate_no VARCHAR(32) NULL,
  certificate_issued_at DATETIME NULL,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  note VARCHAR(255),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uk_user_course (user_id, course_id),
  INDEX idx_course (course_id), INDEX idx_phone (guest_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== INSERT 6 KHÓA HỌC MẪU =====
INSERT INTO courses (course_code,slug,title,category,level,short_desc,teacher_name,total_videos,total_hours,price_original,price_sale,status,featured_home,best_seller) VALUES
('K01','30-huyet-cuu-song','K01 · 30 huyệt châm cứu cứu sống','cham-cuu','co-ban','Tìm đúng 30 huyệt vàng, xử lý 15 bệnh thông thường','PGS.TS Nguyễn Văn A',24,12.3,1990000,1290000,'open',1,1),
('K02','che-bien-50-vi-thuoc','K02 · Chế biến 50 vị thuốc gia đình','thao-duoc','co-ban','Sắc thuốc đúng lửa, ngâm rượu, nấu cháo','Dược. Phạm Thị D',18,9.0,1200000,990000,'open',1,0),
('K03','massage-cuu-chua-dau-lung','K03 · Massage cứu chữa đau lưng','cot-song','trung-cap','12 động tác chuẩn y khoa, giảm thoái hóa L1-L5','BS. Lê Minh C',32,15.0,1990000,1590000,'open',1,0),
('K04','chan-doan-luoi-mach','K04 · Chẩn đoán lưỡi & mạch chuyên sâu','chan-doan','nang-cao','Đọc 7 dạng lưỡi, 28 vị mạch','PGS.TS Nguyễn Văn A',40,18.0,2990000,2490000,'opening_soon',1,0),
('K05','duong-sinh-8-phuong','K05 · Dưỡng sinh 8 phương Tàu Đặng','duong-sinh','co-ban','Tập 8 động tác mỗi sáng 15 phút','BS. Trần Thị B',16,8.0,990000,790000,'open',0,0),
('K06','dieu-hoa-noi-tiet-nu','K06 · Điều hòa nội tiết nữ bằng thảo dược','noi-tiet','trung-cap','Kinh nguyệt, mãn kinh, giảm cân theo thể trạng','BS. Trần Thị B',28,14.0,2200000,1890000,'opening_soon',0,0);

-- ===== VERSION =====
INSERT INTO settings (`group`,`key`,`value`) VALUES ('system','version','3.5.0')
ON DUPLICATE KEY UPDATE value='3.5.0';

SELECT '✅ Migration v3.4 → v3.5 THÀNH CÔNG. 2 bảng mới + 6 khóa học mẫu đã thêm.' AS result;
