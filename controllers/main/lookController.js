import User from '../../models/User.js';
import Gallery from '../../models/Gallery.js';
import Look from '../../models/Look.js';

// Get all the looks the user has saved 
const getAllLooks = async (req, res) => {
  const userID = req.user.id;

  try {
    const user = await User.findById(userID)
      .populate('myLooks')
      .exec();

    if (!user || user.myLooks.length === 0) return res.status(204).json({ message: 'No saved looks found for this user' });

    res.status(200).json({ myLooks: user.myLooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Get one user look
const getLook = async (req, res) => {
  try {
    const userID = req.user.id;
    const { lookId } = req.params;

    const look = await Look.findById(lookId).exec();
    if (!look) return res.status(404).json({ message: 'Look not found' });

    const user = await User.findById(userID).exec();
    const ownsLook = user.myLooks.includes(lookId);

    if (ownsLook) return res.status(200).json({ look });

    if (look.galleryId) {
      const gallery = await Gallery.findById(look.galleryId).exec();
      if (gallery && String(gallery.userId) === userID) {
        return res.status(200).json({ gallery });
      }
    }

    return res.status(403).json({ message: 'You do not have access to this look' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Update a look (notes, tags, aesthetic)
const updateLook = async (req, res) => {
  try {
    const look = req.look;

    const allowedFields = ['title', 'aesthetic', 'tags', 'notes', 'galleryId'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        look[field] = req.body[field];
      }
    });

    await look.save();

    res.status(200).json({ 
      message: 'Look updated successfully',
      look: look 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Create (upload) a look
const createSingleLook = async (req, res) => {
  const userID = req.user.id;
  try {
    const { 
      title,
      aesthetic,
      tags,
      notes,
      galleryId,
      sourceType,
    } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const imagePath = req.file.path;

    const newLook = new Look({
      userId: userID,
      title: title,
      aesthetic: aesthetic,
      notes: notes,
      tags: tags ? tags.split(',') : [],
      galleryId: galleryId || null,
      sourceType: sourceType,
      imagePath: imagePath
    });

    await newLook.save();

    await User.findByIdAndUpdate(userID, {
      $push: { myLooks: newLook._id }
    }).exec();

    res.status(201).json({
      message: 'Look created and added to your profile!',
      look: newLook
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading look' });
  }
}

const createMultipleLooks = async (req, res) => {
  try {
    const userID = req.user.id;
    
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'At least one image is required' });

    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : [];

    const looksToInsert = req.files.map((file, index) => {
      const data = metadata[index] || {}; // default to empty if no metadata
      return {
        userId: userID,
        imagePath: file.path,
        title: data.title || req.body.title || '',
        aesthetic: data.aesthetic || req.body.aesthetic || '',
        notes: data.notes || req.body.notes || '',
        tags: data.tags ? data.tags.split(',') : (req.body.tags ? req.body.tags.split(',') : []),
        galleryId: req.body.galleryId || null,
        sourceType: req.body.sourceType || 'upload'
      };
    });

    const newLooks = await Look.insertMany(looksToInsert);
    const lookIds = newLooks.map(look => look._id);

    await User.findByIdAndUpdate(userID, {
      $push: { myLooks: { $each: lookIds }}
    }).exec();

    res.status(201).json({
      message: 'Looks uploaded successfully',
      looks: newLooks
    });
  } catch (err) {
    console.error(err);

    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {}); // silently ignore errors
      }
    }

    res.status(500).json({ message: 'Error uploading mutliple looks' }); 
  }
}

// Delete a look
const deleteLook = async (req, res) => {
  const userID = req.user.id;
  const look = req.look;
  const lookID = look._id;

  try {
    const deletedLook = await Look.deleteOne({ _id: lookID }).exec();

    await User.findByIdAndUpdate(userID, {
      $pull: { myLooks: lookID }
    }).exec();

    if (look.galleryId) {
      await Gallery.findByIdAndUpdate(look.galleryId, {
        $pull: { looks: lookID }
      }).exec();
    }

    if (deletedLook.deletedCount === 0) return res.status(500).json({ message: 'Failed to delete the look' });

    res.status(200).json({ message: 'Look successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default {
  getAllLooks,
  getLook,
  updateLook,
  createSingleLook,
  createMultipleLooks,
  deleteLook
}