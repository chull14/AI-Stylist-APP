const verifyUserParam = (req, res, next) => {

  console.log('Auth user:', req.user.id);
  console.log('Route param user:', req.params.userId);
  if (req.params.userId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized user access' });
  }
  next();
};

export default verifyUserParam;