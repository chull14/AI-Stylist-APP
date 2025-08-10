import User from '../../models/User.js';
import Gallery from '../../models/Gallery.js';
import Look from '../../models/Look.js';

// Get all the looks the user has saved 
const getAllLooks = async (req, res) => {
  const userID = req.user.id;

  try {
    const looks = await Look.find({ userId: userID }).exec();

    if (!looks || looks.length === 0) return res.status(204).json({ message: 'No saved looks found for this user' });

    res.status(200).json({ looks: looks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Get one user look
const getLook = async (req, res) => {
  try {
    const userID = req.user.id;
    const look = req.look;

    // Check if user owns the look
    if (String(look.userId) === String(userID)) {
      return res.status(200).json({ look });
    }

    // Check if look belongs to user's gallery
    if (look.galleryId) {
      const gallery = await Gallery.findById(look.galleryId).exec();
      if (gallery && String(gallery.userId) === userID) {
        return res.status(200).json({ look });
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

    const allowedFields = ['title', 'description', 'style', 'occasion', 'items', 'aesthetic', 'tags', 'notes', 'galleryId', 'season', 'colorPreference', 'isLiked'];
    const arrayFields = ['aesthetic', 'tags', 'items'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (arrayFields.includes(field)) {
          look[field] = Array.isArray(req.body[field])
            ? req.body[field]
            : req.body[field].split(',').map(item => item.trim()).filter(Boolean);
        } else {
          look[field] = req.body[field];
        }
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
      description,
      style,
      occasion,
      items,
      aesthetic,
      tags,
      notes,
      galleryId,
      sourceType,
      season,
      colorPreference
    } = req.body;

    // Handle image upload if provided
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    const newLook = new Look({
      userId: userID,
      title: title,
      description: description || '',
      style: style || 'Casual',
      occasion: occasion || 'Everyday',
      items: items ? (Array.isArray(items) ? items : items.split(',').map(item => item.trim()).filter(Boolean)) : [],
      aesthetic: aesthetic ? (Array.isArray(aesthetic) ? aesthetic : aesthetic.split(',')) : [],
      notes: notes || '',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      galleryId: galleryId || null,
      sourceType: sourceType || 'upload',
      season: season || 'All Season',
      colorPreference: colorPreference || 'Neutral',
      imagePath: imagePath,
      image: imagePath // Also set the image field for frontend compatibility
    });

    await newLook.save();

    res.status(201).json({
      message: 'Look created successfully',
      look: newLook
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating look' });
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
        image: file.path, // Also set the image field for frontend compatibility
        title: data.title || req.body.title || '',
        description: data.description || req.body.description || '',
        style: data.style || req.body.style || 'Casual',
        occasion: data.occasion || req.body.occasion || 'Everyday',
        items: data.items ? (Array.isArray(data.items) ? data.items : data.items.split(',').map(item => item.trim()).filter(Boolean)) : [],
        aesthetic: data.aesthetic ? (Array.isArray(data.aesthetic) ? data.aesthetic : data.aesthetic.split(',')) : (req.body.aesthetic ? (Array.isArray(req.body.aesthetic) ? req.body.aesthetic : req.body.aesthetic.split(',')) : []),
        notes: data.notes || req.body.notes || '',
        tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(',')) : (req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',')) : []),
        galleryId: req.body.galleryId || null,
        sourceType: req.body.sourceType || 'upload',
        season: data.season || req.body.season || 'All Season',
        colorPreference: data.colorPreference || req.body.colorPreference || 'Neutral'
      };
    });

    const newLooks = await Look.insertMany(looksToInsert);

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

    res.status(500).json({ message: 'Error uploading multiple looks' }); 
  }
}

// Delete a look
const deleteLook = async (req, res) => {
  const userID = req.user.id;
  const look = req.look;
  const lookID = look._id;

  try {
    const deletedLook = await Look.deleteOne({ _id: lookID }).exec();

    if (deletedLook.deletedCount === 0) return res.status(500).json({ message: 'Failed to delete the look' });

    res.status(200).json({ message: 'Look successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

const addLookToGallery = async (req, res) => {
  try {
    const look = req.look;
    const galleryID = req.gallery._id;
    look.galleryId = galleryID;
    await look.save();

    res.status(200).json({ message: 'Look successfully moved to gallery' });
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
  deleteLook,
  addLookToGallery
}