import Closet from '../../models/Closet.js';
import User from '../../models/User.js';

// upload item to closet
const uploadItem = async (req, res) => {
  const userID = req.user.id;
  try {
    const { 
      name,
      aesthetic,
      colors,
      brand,
      notes,
      tags,
     } = req.body;

     if (!req.file) return res.status(400).json({ message: 'Image is required' });

     const imagePath = req.file.path;

     const newItem = new Closet({
      userId: userID,
      imagePath: imagePath,
      name: name,
      aesthetic: aesthetic ? aesthetic.split(', ') : [],
      brand: brand,
      notes: notes,
      colors: colors ? colors.split(', ') : [],
      tags: tags ? tags.split(', ') : []
     });

     await newItem.save();

     await User.findByIdAndUpdate(userID, {
      $push: { closet: newItem._id }
    }).exec();

    res.status(201).json({
      message: 'New item added to your closet',
      item: newItem
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading closet item' });
  }
}

// get entire closet
const getCloset = async (req, res) => {
  const userID = req.user.id;
  try {
    const items = await Closet.find({ userId: userID }).exec();

    if (!items || items.length === 0) return res.status(204).json({ message: 'Closet is empty'});

    res.status(200).json({ closet: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// get one closet item
const getClosetItem = async (req, res) => {
  const userID = req.user.id;
  try {
    const closetID = req.params.closetId;
    if (!closetID) return res.status(400).json({ message: 'Closet item ID required' });

    const item = await Closet.findById({ _id: closetID }).exec();
    if (!item) return res.status(204).json({ message: 'Closet item not found'});

    const user = await User.findById(userID).select('closet').exec();

    const ownsItem = user.closet.some(id => String(id) === String(item._id));
    
    if (ownsItem) return res.status(200).json({ item });

    return res.status(403).json({ message: 'You do not have access to this look' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// update a closet item
const updateItem = async (req, res) => {
  console.log('im here');
  try {
    const closetID = req.params.closetId;
    if (!closetID) return res.status(400).json({ message: 'Closet item ID required' });

    const item = await Closet.findById({ _id: closetID }).exec();
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const allowedFields = ['name', 'category', 'aesthetic', 'colors', 'brand', 'notes', 'tags'];
    const arrayFields = ['aesthetic', 'colors', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (arrayFields.includes(field)) {
          item[field] = Array.isArray(req.body[field])
            ? req.body[field]
            : req.body[field].split(', ');
        } else {
          item[field] = req.body[field];
        }
      }
    });

    await item.save();

    res.status(200).json({ 
      message: 'Item updated successfully',
      item: item 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

// remove item from closet
const deleteItem = async (req, res) => {
  const userID = req.user.id; 
  try {
    const closetID = req.params.closetId;
    if (!closetID) return res.status(400).json({ message: 'Closet item ID required' });

    const item = await Closet.findOne({ _id: closetID, userId: userID }).exec();
    if (!item) return res.status(404).json({ message: 'Item not found in closet' });

    const deletedItem = await Closet.deleteOne({ _id: closetID }).exec();

    if (deletedItem.deletedCount === 0) return res.status(500).json({ message: 'Failed to remove the item from closet' });

    await User.findByIdAndUpdate(userID, {
      $pull: { closet: closetID }
    }).exec();

    res.status(200).json({ message: 'Item successfully removed from closet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

export default {
  uploadItem,
  getCloset,
  getClosetItem,
  updateItem,
  deleteItem
}