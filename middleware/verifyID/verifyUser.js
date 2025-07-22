const verifyUserParam = (req, res, next) => {
  const routeId = req.params?.userId;
  const tokenId = req.user?.id;

  if (!routeId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  if (String(routeId) !== String(tokenId)) {
    return res.status(403).json({ message: 'Unauthorized user access' });
  }

  next();
};

export default verifyUserParam;