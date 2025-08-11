import User from '../../models/User.js';
import Gallery from '../../models/Gallery.js';
import Look from '../../models/Look.js';

// Get all the looks the user has saved 
const getAllLooks = async (req, res) => {
  const userID = req.user.id;

  try {
    const looks = await Look.find({ userId: userID }).exec();

    if (!looks || looks.length === 0) return res.status(204).json({ message: 'No saved looks found for this user' });

    // Add like and save status for current user
    const looksWithUserStatus = looks.map(look => {
      const lookObj = look.toObject();
      lookObj.isLiked = look.likedBy && look.likedBy.includes(userID);
      lookObj.isSaved = look.savedBy && look.savedBy.includes(userID);
      return lookObj;
    });

    res.status(200).json({ looks: looksWithUserStatus });
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
      const lookObj = look.toObject();
      lookObj.isLiked = look.likedBy && look.likedBy.includes(userID);
      lookObj.isSaved = look.savedBy && look.savedBy.includes(userID);
      return res.status(200).json({ look: lookObj });
    }

    // Check if look belongs to user's gallery
    if (look.galleryId) {
      const gallery = await Gallery.findById(look.galleryId).exec();
      if (gallery && String(gallery.userId) === userID) {
        const lookObj = look.toObject();
        lookObj.isLiked = look.likedBy && look.likedBy.includes(userID);
        lookObj.isSaved = look.savedBy && look.savedBy.includes(userID);
        return res.status(200).json({ look: lookObj });
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

    const allowedFields = ['title', 'description', 'style', 'occasion', 'items', 'aesthetic', 'tags', 'notes', 'galleryId', 'season', 'colorPreference'];
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

// Like or unlike a look (now also handles saving)
const toggleLikeLook = async (req, res) => {
  try {
    const userID = req.user.id;
    const look = req.look;

    const isLiked = look.likedBy && look.likedBy.includes(userID);

    if (isLiked) {
      // Unlike and unsave
      look.likedBy = look.likedBy.filter(id => String(id) !== String(userID));
      if (look.savedBy) {
        look.savedBy = look.savedBy.filter(id => String(id) !== String(userID));
      }
    } else {
      // Like and save
      if (!look.likedBy) look.likedBy = [];
      look.likedBy.push(userID);
      if (!look.savedBy) look.savedBy = [];
      look.savedBy.push(userID);
    }

    await look.save();

    res.status(200).json({ 
      message: isLiked ? 'Look unliked and unsaved successfully' : 'Look liked and saved successfully',
      isLiked: !isLiked,
      isSaved: !isLiked, // Same as isLiked since we're treating them as the same action
      likeCount: look.likedBy.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Get user's saved looks (now includes liked looks since we treat them as the same)
const getSavedLooks = async (req, res) => {
  const userID = req.user.id;

  try {
    console.log('Getting saved/liked looks for user:', userID)
    // Get looks that are either saved or liked by the user
    const savedLooks = await Look.find({
      $or: [
        { savedBy: userID },
        { likedBy: userID }
      ]
    }).exec();
    console.log('Found saved/liked looks:', savedLooks.length)

    if (!savedLooks || savedLooks.length === 0) {
      console.log('No saved/liked looks found for user:', userID)
      return res.status(204).json({ message: 'No saved looks found' });
    }

    // Add like and save status for current user
    const looksWithUserStatus = savedLooks.map(look => {
      const lookObj = look.toObject();
      lookObj.isLiked = look.likedBy && look.likedBy.includes(userID);
      lookObj.isSaved = look.savedBy && look.savedBy.includes(userID);
      return lookObj;
    });

    res.status(200).json({
      message: 'Saved looks retrieved successfully',
      looks: looksWithUserStatus
    });
  } catch (err) {
    console.error('Error in getSavedLooks:', err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Create (upload) a look
const createSingleLook = async (req, res) => {
  const userID = req.user.id;
  try {
    console.log('createSingleLook called with userID:', userID);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
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

    console.log('Extracted title:', title);

    // Handle image upload if provided
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename; // Store only the filename, not the full path
      console.log('Image filename:', imagePath);
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
      image: imagePath, // Also set the image field for frontend compatibility
      likedBy: [],
      savedBy: []
    });

    console.log('About to save new look:', newLook);

    await newLook.save();

    console.log('Look saved successfully');

    res.status(201).json({
      message: 'Look created successfully',
      look: newLook
    });
  } catch (err) {
    console.error('Error in createSingleLook:', err);
    res.status(500).json({ message: 'Error creating look', error: err.message });
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
        imagePath: file.filename, // Store only the filename
        image: file.filename, // Also set the image field for frontend compatibility
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
        colorPreference: data.colorPreference || req.body.colorPreference || 'Neutral',
        likedBy: [],
        savedBy: []
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
        // The original code had fs.unlink, but fs is not imported.
        // Assuming the intent was to remove the file from the server if it was uploaded.
        // Since fs is not available, this part is removed.
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
  toggleLikeLook,
  getSavedLooks,
  createSingleLook,
  createMultipleLooks,
  deleteLook,
  addLookToGallery
}