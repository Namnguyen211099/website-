import api from './client.js';

// Public: khách đặt lịch
export const createAppointment = data =>
  api.post('/appointments', data).then(r => r.data);

// Admin
export const getAppointments = (params = {}) =>
  api.get('/appointments', { params }).then(r => r.data);

export const getAppointmentStats = () =>
  api.get('/appointments/stats').then(r => r.data);

export const updateAppointmentStatus = (id, status) =>
  api.patch('/appointments/' + id + '/status', { status }).then(r => r.data);

export const updateAppointment = (id, data) =>
  api.put('/appointments/' + id, data).then(r => r.data);

export const deleteAppointment = id =>
  api.delete('/appointments/' + id).then(r => r.data);

// ===== THANH TOÁN =====
export const createVNPayPayment = (appointment_id, amount) =>
  api.post('/payment/vnpay/create', { appointment_id, amount }).then(r => r.data);

export const createMomoPayment = (appointment_id, amount) =>
  api.post('/payment/momo/create', { appointment_id, amount }).then(r => r.data);

// ===== UPLOAD ẢNH =====
export const uploadImage = file => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

export const uploadMultiple = files => {
  const fd = new FormData();
  files.forEach(f => fd.append('images', f));
  return api.post('/upload/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
