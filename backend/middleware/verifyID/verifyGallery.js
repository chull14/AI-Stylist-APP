import Gallery from '../../models/Gallery.js';

const verifyGalleryOwnership = async (req, res, next) => {
  const userId = req.user.id;
  const galleryId = req.params.galleryId;

  if (!galleryId) {
    return res.status(400).json({ message: 'Gallery ID is required' });
  }

  try {
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    if (String(gallery.userId) !== userId) {
      return res.status(403).json({ message: 'You do not have permission to access this gallery' });
    }

    req.gallery = gallery;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export default verifyGalleryOwnership;