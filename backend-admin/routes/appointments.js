const r = require('express').Router();
const c = require('../controllers/appointmentsController');
const { protect, isAdmin } = require('../middleware/auth');
const { hasRole } = require('../middleware/hasRole');
r.post('/', c.createPublic);
r.get('/', protect, hasRole(['super_admin','admin','reception','doctor']), c.adminList);
r.get('/stats', protect, c.stats);
r.patch('/:id/status', protect, hasRole(['super_admin','admin','reception']), c.updateStatus);
module.exports = r;
