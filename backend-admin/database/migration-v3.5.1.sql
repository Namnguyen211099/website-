USE dxgroup;

ALTER TABLE course_enrollments ADD UNIQUE KEY uk_payment_code (payment_code);

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

-- These constraints are intended for existing v3.5 databases.
ALTER TABLE appointments
  ADD CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

ALTER TABLE patients
  ADD CONSTRAINT fk_patients_doctor FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE medical_records
  ADD CONSTRAINT fk_records_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_records_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;

ALTER TABLE prescriptions
  ADD CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_prescriptions_record FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE SET NULL;

ALTER TABLE prescription_items
  ADD CONSTRAINT fk_prescription_items_item FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT;

ALTER TABLE accounting_entries
  ADD CONSTRAINT fk_accounting_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE inventory_transactions
  ADD CONSTRAINT fk_inventory_tx_item FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_inventory_tx_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_inventory_tx_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE courses
  ADD CONSTRAINT fk_courses_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
