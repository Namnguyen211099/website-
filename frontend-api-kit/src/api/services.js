/**
 * Dịch vụ API · Thay thế dữ liệu cứng / localStorage
 * Dùng: import { getAllServices } from '@/api/services'
 */
import api from './client.js';

export const getAllServices = (params = {}) =>
  api.get('/services', { params }).then(r => r.data);

export const getServiceBySlug = slug =>
  api.get('/services/' + slug).then(r => r.data.data);

// --- ADMIN ONLY ---
export const getAllServicesAdmin = () =>
  api.get('/services/admin/all').then(r => r.data);

export const createService = data =>
  api.post('/services', data).then(r => r.data);

export const updateService = (id, data) =>
  api.put('/services/' + id, data).then(r => r.data);

export const deleteService = id =>
  api.delete('/services/' + id).then(r => r.data);
