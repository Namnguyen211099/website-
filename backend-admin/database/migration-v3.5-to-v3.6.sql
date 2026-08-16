-- ============================================
-- Migration DXGroup v3.5 -> v3.6
-- Them truong hinh anh va video
-- ============================================

-- 1. Them truong image cho bang inventory_items (anh san pham kho thuoc)
ALTER TABLE inventory_items 
ADD COLUMN IF NOT EXISTS image VARCHAR(500) NULL COMMENT 'URL hinh anh san pham' 
AFTER category;

-- 2. Them truong video_url va has_video cho bang courses (video gioi thieu khoa hoc)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS video_url VARCHAR(500) NULL COMMENT 'URL video gioi thieu (YouTube)' 
AFTER thumbnail,
ADD COLUMN IF NOT EXISTS has_video TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Co video gioi thieu hay khong' 
AFTER video_url;

-- ============================================
-- Cap nhat du lieu mau cho v3.6
-- ============================================

-- Cap nhat hinh anh cho mot so san pham inventory mau
UPDATE inventory_items SET image = 'https://images.unsplash.com/photo-1596755389378-c17d6f0e6b8d?w=400&h=200&fit=crop' WHERE name LIKE '%Nhan sam%' OR name LIKE '%nhan sam%';
UPDATE inventory_items SET image = 'https://images.unsplash.com/photo-1615485507686-4676869cb8f0?w=400&h=200&fit=crop' WHERE name LIKE '%Dong trung%' OR name LIKE '%dong trung%';
UPDATE inventory_items SET image = 'https://images.unsplash.com/photo-1597362925121-813a200b9281?w=400&h=200&fit=crop' WHERE name LIKE '%Ngu vi%' OR name LIKE '%ngu vi%';

-- Cap nhat video cho khoa hoc mau
UPDATE courses SET 
  video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  has_video = 1 
WHERE title LIKE '%cuu thuong%' OR title LIKE '%Cuu thuong%';

-- ============================================
-- Hoan tat migration v3.6
-- ============================================
