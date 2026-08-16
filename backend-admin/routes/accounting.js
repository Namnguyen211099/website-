const r = require('express').Router();
const c = require('../controllers/accountingController');
const { protect } = require('../middleware/auth');
const { roleAtLeast } = require('../middleware/hasRole');
r.use(protect, roleAtLeast('admin'));
r.get('/summary', c.summary);
r.get('/entries', c.entries);
r.post('/entries', c.createEntry);
module.exports = r;
