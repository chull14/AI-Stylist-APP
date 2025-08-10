import Look from '../../models/Look.js';

const verifyLook = async (req, res, next) => {
  const userId = req.user.id;
  const lookId = req.params.lookId;

  if (!lookId) {
    return res.status(400).json({ message: 'Look ID is required' });
  }

  try {
    const look = await Look.findById(lookId);
    if (!look) {
      return res.status(404).json({ message: 'Look not found' });
    }

    // For like operations, allow access to any look (since likes are now saves)
    // For edit and delete operations, require ownership
    const isLikeOperation = req.path.includes('/like');
    const isEditOrDeleteOperation = req.method === 'PUT' || req.method === 'DELETE';

    if (isEditOrDeleteOperation && String(look.userId) !== userId) {
      return res.status(403).json({ message: 'You do not have permission to modify this look' });
    }

    req.look = look;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export default verifyLook;