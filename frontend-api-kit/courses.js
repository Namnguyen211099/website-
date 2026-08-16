// DXGroup Frontend API Kit · Module Khóa học v3.5
// Dùng trong React Frontend: import coursesApi from '@/api/courses'
import axios from 'axios';
const api = axios.create({ baseURL: '/api', timeout: 15000 });

export const coursesApi = {
  // Danh sách khóa học công khai (Trang Khóa học)
  list: (params = {}) => api.get('/courses', { params }).then(r => r.data),
  // 4 khóa nổi bật (Trang chủ)
  featured: () => api.get('/courses/featured').then(r => r.data),
  // Chi tiết 1 khóa theo slug (tăng view tự động + trả giáo viên + khóa liên quan)
  getBySlug: (slug) => api.get(`/courses/${slug}`).then(r => r.data),
  // Đăng ký khóa học (guest hoặc member đã login)
  enroll: (courseId, payload) => api.post(`/courses/${courseId}/register`, payload).then(r => r.data),
  // Member: danh sách khóa của tôi
  myEnrollments: () => api.get('/courses/enrollments/my').then(r => r.data),
  // Admin: thống kê KPI khóa học
  adminStats: () => api.get('/courses/stats').then(r => r.data),
  // Admin: CRUD
  adminList: () => api.get('/courses/admin/list').then(r => r.data),
  adminCreate: (data) => api.post('/courses/admin', data).then(r => r.data),
  adminUpdate: (id, data) => api.put(`/courses/admin/${id}`, data).then(r => r.data),
  adminDelete: (id) => api.delete(`/courses/admin/${id}`).then(r => r.data),
  // Admin: học viên
  adminEnrollments: (params = {}) => api.get('/courses/enrollments/admin', { params }).then(r => r.data),
  updateEnrollmentStatus: (id, data) => api.patch(`/courses/enrollments/${id}/status`, data).then(r => r.data),
  sendReminder: (id) => api.post(`/courses/enrollments/${id}/reminder`).then(r => r.data),
};

export default coursesApi;
