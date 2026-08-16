import api from './client.js';

export const getAllBlogs = (params = {}) => api.get('/blogs', { params }).then(r => r.data);
export const getBlogFeatured = () => api.get('/blogs', { params: { featured: 1, limit: 3 } }).then(r => r.data);
export const getBlogBySlug = slug => api.get('/blogs/' + slug).then(r => r.data);
export const getAllBlogsAdmin = () => api.get('/blogs/admin/all').then(r => r.data);
export const createBlog = d => api.post('/blogs', d).then(r => r.data);
export const updateBlog = (id, d) => api.put('/blogs/' + id, d).then(r => r.data);
export const deleteBlog = id => api.delete('/blogs/' + id).then(r => r.data);
export const setFeaturedBlog = id => api.patch('/blogs/' + id + '/featured').then(r => r.data);
