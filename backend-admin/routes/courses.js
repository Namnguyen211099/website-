const r = require('express').Router();
const c = require('../controllers/coursesController');
const e = require('../controllers/courseEnrollmentsController');
const { protect, isAdmin } = require('../middleware/auth');
const { hasRole } = require('../middleware/hasRole');

// PUBLIC
r.get('/', c.listPublic);
r.get('/featured', c.featuredPublic);
r.get('/stats', protect, isAdmin, c.stats);
r.get('/admin/list', protect, isAdmin, c.adminList);
r.get('/admin/:id', protect, isAdmin, c.adminGet);
r.post('/admin', protect, isAdmin, c.adminCreate);
r.put('/admin/:id', protect, isAdmin, c.adminUpdate);
r.delete('/admin/:id', protect, isAdmin, c.adminDelete);

// ENROLLMENTS
r.post('/:id/register', (req, res, next) => { if (req.headers.authorization) protect(req, res, next); else next(); }, e.enrollPublic);
r.get('/enrollments/my', protect, e.myEnrollments);
r.get('/enrollments/admin', protect, hasRole(['super_admin','admin','reception']), e.adminList);
r.patch('/enrollments/:id/status', protect, hasRole(['super_admin','admin','reception']), e.updateStatus);
r.post('/enrollments/:id/reminder', protect, hasRole(['super_admin','admin','reception']), e.sendReminder);

r.get('/:slug', c.getPublic);
module.exports = r;
