const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role) return res.sendStatus(401);
    if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  }
}

export default verifyRoles;