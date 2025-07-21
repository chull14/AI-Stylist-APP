import User from '../../models/User.js';
import Gallery from '../../models/Gallery.js';
import Look from '../../models/Look.js';

// Get all user galleries 
const getAllGalleries = async (req, res) => {
  const userID = req.params.userId;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const galleries = await Gallery.find({ userId: userID }).exec();
    if (!galleries || galleries.length === 0) return res.status(204).json({ message: 'No galleries found for this user' });

    res.status(200).json({ galleries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Get one user gallery
const getGallery = async (req, res) => {
  const userID = req.params.userId;
  const galleryID = req.params.galleryId;

  if (!userID || !galleryID) return res.status(400).json({ message: 'UserID and GalleryID are required' });

  try {
    const gallery = await Gallery.findOne({ _id: galleryID, userId: userID }).exec();
    if (!gallery) return res.status(404).json({ message: 'Gallery not found for this user' });

    const looks = await Look.find({ userId: userID, galleryId: galleryID }).exec();

    res.status(200).json({
      message: "Gallery looks successfully retrieved",
      data: {
        gallery,
        looks
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Create a gallery
const createGallery = async (req, res) => {
  const userID = req.params.userId;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  const { title, description } = req.body;

  try {
    const newGallery = await Gallery.create({
      "title": title,
      "description": description,
      "userId": userID
    });

    res.status(201).json({ 
      message: 'New Gallery Created',
      galleryID: newGallery._id,
      data: newGallery
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Update gallery
const updateGallery = async (req, res) => {
  const userID = req.params.userId;
  const galleryID = req.params.galleryId;
  if (!userID || !galleryID) return res.status(400).json({ message: 'UserID and GalleryID are required' });

  const { title, description } = req.body;

  try {
    const gallery = await Gallery.findOne({ _id: galleryID, userId: userID }).exec();
    if (!gallery) return res.status(404).json({ message: 'Gallery not found for this user' });

    if (title) gallery.title = title;
    if (description) gallery.description = description;

    await gallery.save();
    res.status(200).json({ 
      message: 'Gallery successfully updated',
      updatedAt: gallery.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Delete gallery
const deleteGallery = async (req, res) => {
  const userID = req.params.userId;
  const galleryID = req.params.galleryId;
  if (!userID || !galleryID) return res.status(400).json({ message: 'UserID and GalleryID are required' });

  try {
    const gallery = await Gallery.findOne({ _id: galleryID, userId: userID }).exec();
    if (!gallery) return res.status(404).json({ message: 'Gallery not found for this user' });

    const deletedGallery = await Gallery.deleteOne({ _id: galleryID }).exec();

    if (deletedGallery.deletedCount === 0) {
      return res.status(500).json({ message: 'Failed to delete gallery' });
    }

    res.status(200).json({ message: "Gallery successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

const addLookToGallery = async (req, res) => {
  const { lookID, galleryID } = req.params;
  const userID = req.user.id;

  try {
    const look = await Look.findById(lookID).exec();
    if (!look || String(look.userId) !== userID) {
      return res.status(403).json({ message: 'You can only acces your own looks' });
    }

    look.galleryId = galleryID;
    await look.save();

    res.status(200).json({ message: 'Look successfully moved to gallery' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });  
  }
}

export default { 
  getAllGalleries,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  addLookToGallery
}