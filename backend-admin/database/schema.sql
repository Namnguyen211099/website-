-- ============================================================
-- DXGroup v3.5.1 FULL SCHEMA (18 bảng)
-- v3.5: courses, course_enrollments; v3.5.1: payment_transactions + constraints
-- ============================================================
CREATE DATABASE IF NOT EXISTS dxgroup DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dxgroup;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role ENUM('super_admin','admin','pharmacist','doctor','reception','member') NOT NULL DEFAULT 'member',
  status ENUM('active','inactive','banned') NOT NULL DEFAULT 'active',
  doctor_profile_id INT NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role), INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(60),
  short_desc VARCHAR(255),
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  duration_min INT DEFAULT 30,
  icon VARCHAR(60),
  image VARCHAR(500),
  featured TINYINT DEFAULT 0,
  published TINYINT DEFAULT 1,
  allow_booking TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(150) UNIQUE NOT NULL,
  user_id INT NULL,
  full_name VARCHAR(100) NOT NULL,
  title VARCHAR(60),
  specialty VARCHAR(80),
  years_exp INT DEFAULT 0,
  bio TEXT,
  education TEXT,
  strengths JSON,
  schedule VARCHAR(200),
  avatar VARCHAR(500),
  featured TINYINT DEFAULT 0,
  published TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(60),
  excerpt VARCHAR(255),
  content LONGTEXT,
  cover_image VARCHAR(500),
  author_id INT NULL,
  tags JSON,
  views INT DEFAULT 0,
  featured TINYINT DEFAULT 0,
  status ENUM('draft','published') DEFAULT 'published',
  meta_title VARCHAR(160),
  meta_desc VARCHAR(255),
  published_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  patient_id INT NULL,
  service_id INT NULL,
  doctor_id INT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  appt_date DATE NOT NULL,
  appt_time TIME NOT NULL,
  note VARCHAR(255),
  status ENUM('pending','confirmed','done','cancelled','no_show') DEFAULT 'pending',
  amount DECIMAL(12,2) DEFAULT 0,
  paid TINYINT DEFAULT 0,
  source VARCHAR(30) DEFAULT 'website',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (appt_date), INDEX idx_status (status), INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  `group` VARCHAR(50) NOT NULL DEFAULT 'general',
  `key` VARCHAR(80) NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string',
  UNIQUE KEY uk_group_key (`group`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  action VARCHAR(60) NOT NULL,
  table_name VARCHAR(60),
  record_id INT,
  old_value JSON, new_value JSON,
  ip VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- V3.3 KẾ TOÁN
CREATE TABLE IF NOT EXISTS accounting_entries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  entry_date DATE NOT NULL,
  type ENUM('income','expense') NOT NULL,
  category VARCHAR(50) NOT NULL,
  reference_type VARCHAR(30),
  reference_id BIGINT NULL,
  amount DECIMAL(14,2) NOT NULL,
  method VARCHAR(30) NOT NULL DEFAULT 'cash',
  payer_payee VARCHAR(150),
  note VARCHAR(255),
  created_by INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (entry_date), INDEX idx_type_cat (type, category),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- V3.4 KHO
CREATE TABLE IF NOT EXISTS inventory_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(40) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(60),
  unit VARCHAR(20) DEFAULT 'viên',
  qty INT NOT NULL DEFAULT 0,
  avg_cost DECIMAL(12,2) DEFAULT 0,
  alert_low INT DEFAULT 10,
  expiry_alert_days INT DEFAULT 30,
  note VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_batches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT NOT NULL,
  batch_no VARCHAR(60) NOT NULL,
  qty_in INT NOT NULL,
  qty_remaining INT NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,
  expiry_date DATE NULL,
  inbound_date DATE NOT NULL,
  note VARCHAR(255),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  UNIQUE KEY uk_item_batch (item_id, batch_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  item_id INT NOT NULL,
  batch_id INT NULL,
  tx_type ENUM('in','out','stocktake') NOT NULL,
  qty INT NOT NULL,
  unit_cost DECIMAL(12,2),
  reference_type VARCHAR(30),
  reference_id BIGINT NULL,
  note VARCHAR(255),
  created_by INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- V3.4 BỆNH NHÂN
CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_code VARCHAR(16) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  gender ENUM('male','female','other') NOT NULL,
  birth_date DATE,
  phone VARCHAR(20),
  email VARCHAR(100),
  address VARCHAR(255),
  blood_group VARCHAR(5),
  allergies TEXT,
  chronic_diseases TEXT,
  assigned_doctor_id INT NULL,
  user_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phone), INDEX idx_code (patient_code),
  FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS medical_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id BIGINT NULL,
  visit_date DATETIME NOT NULL,
  chief_complaint VARCHAR(255),
  diagnosis VARCHAR(255),
  the_trang VARCHAR(100),
  treatment TEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS prescriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  record_id BIGINT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('draft','approved','dispensed','cancelled') DEFAULT 'draft',
  total_amount DECIMAL(12,2) DEFAULT 0,
  note VARCHAR(255),
  approved_at DATETIME NULL,
  dispensed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS prescription_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  prescription_id BIGINT NOT NULL,
  item_id INT NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  dosage VARCHAR(100),
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============ V3.5 KHÓA HỌC (MỚI) ============
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
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status), INDEX idx_featured (featured_home), INDEX idx_cat_level (category, level)
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
  UNIQUE KEY uk_payment_code (payment_code),
  INDEX idx_course (course_id), INDEX idx_phone (guest_phone), INDEX idx_payment (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- V3.5.1 PAYMENT TRANSACTIONS / IDEMPOTENCY
CREATE TABLE IF NOT EXISTS payment_transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  gateway ENUM('vnpay','momo') NOT NULL,
  transaction_code VARCHAR(100) NOT NULL,
  order_type VARCHAR(30) NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  gateway_transaction_id VARCHAR(100) NULL,
  response_code VARCHAR(30) NULL,
  raw_response JSON NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_gateway_transaction (gateway, transaction_code),
  INDEX idx_order (order_type, order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
