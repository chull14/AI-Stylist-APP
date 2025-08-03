import Gallery from '../../models/Gallery.js';
import Look from '../../models/Look.js';

// Get all user galleries 
const getAllGalleries = async (req, res) => {
  const userID = req.user.id;

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
  const userID = req.user.id;

  try {
    const gallery = req.gallery;
    const looks = await Look.find({ userId: userID, galleryId: gallery._id }).exec();

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
  const userID = req.user.id;
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
  try {
    const gallery = req.gallery;
    const { title, description } = req.body;

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
  try {
    const gallery = req.gallery;
    const deletedGallery = await Gallery.deleteOne({ _id: gallery._id }).exec();

    if (deletedGallery.deletedCount === 0) {
      return res.status(500).json({ message: 'Failed to delete gallery' });
    }

    res.status(200).json({ message: "Gallery successfully deleted" });
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
  deleteGallery
}