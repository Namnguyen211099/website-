const ROLE_LEVEL = { super_admin: 1, admin: 2, pharmacist: 3, doctor: 4, reception: 5, member: 6 };
exports.ROLE_LEVEL = ROLE_LEVEL;
exports.roleAtLeast = (role) => (req, res, next) => {
  if (ROLE_LEVEL[req.user.role] <= ROLE_LEVEL[role]) return next();
  res.status(403).json({ ok: false, error: 'Không đủ quyền' });
};
exports.hasRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) return next();
  res.status(403).json({ ok: false, error: 'Không đủ quyền' });
};
exports.doctorSelfOnly = (req, res, next) => {
  if (req.user.role === 'doctor' && parseInt(req.params.id) !== req.user.doctor_profile_id)
    return res.status(403).json({ ok: false, error: 'BS chỉ xem hồ sơ của mình' });
  next();
};
