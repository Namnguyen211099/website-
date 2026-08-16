import api from './client.js';

export const getAllDoctors = (params = {}) => api.get('/doctors', { params }).then(r => r.data);
export const getAllDoctorsAdmin = () => api.get('/doctors/admin/all').then(r => r.data);
export const createDoctor = d => api.post('/doctors', d).then(r => r.data);
export const updateDoctor = (id, d) => api.put('/doctors/' + id, d).then(r => r.data);
export const deleteDoctor = id => api.delete('/doctors/' + id).then(r => r.data);
