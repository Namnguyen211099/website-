import api from './client.js';

// Lấy toàn bộ cài đặt (dùng cho Header + Footer + Contact)
// → trả về { general: {clinicName, hotline, address...}, brand: {primaryColor, goldColor} }
export const getAllSettings = () => api.get('/settings').then(r => r.data.data);

export const getSettingsGroup = group => api.get('/settings/' + group).then(r => r.data.data);

// Admin: lưu hàng loạt
export const saveSettings = (group, values) =>
  api.put('/settings', { group, values }).then(r => r.data);
