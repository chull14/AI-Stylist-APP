import User from '../../models/User.js';
import Gallery from '../../models/Gallery.js';
import Looks from '../../models/Look.js';
import bcrypt from 'bcrypt';

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userID = req.user.id; 

    const user = await User.findById(userID)
      .select('username email stylePreferences favoriteBrands') // include only safe fields
      .populate('myLooks')
      .populate('closet')
      .populate('favorites')
      .exec();
    
    const galleries = await Gallery.find({ userId: userID }).exec();

    if (!user) {
      return res.status(404).json({ message: `User ${user.username} not found` });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      profile: {
        user: user,
        userGalleries: galleries
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ 'message': 'No employees found.' });
  res.status(200).json({ "All Users:" : users });
}

// Get user
const getUser = async (req, res) => {
  const userID = req.user.id;
  const user = await User.findById(userID).select('username email').exec();

  if (!user) {
    return res.status(404).json({ message: `User not found` });
  }
  res.status(200).json({
    message: 'User found',
    data: { 
      username: user.username,
      email: user.email
    }
  });
}

// Update user
const updateUser = async (req, res) => {
  const userID = req.user.id;
  const user = await User.findById(userID).select('+password').exec();
  if (!user) {
    return res.status(404).json({ message: `No user matches ID ${userID}` });
  }

  // if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
  //   return res.status(403).json({ message: 'Forbidden: not your account' });
  // }

  if (req.body?.username) user.username = req.body.username;
  if (req.body?.email) user.email = req.body.email;

  if (req.body.oldpwd && req.body.newpwd) {
    const match = await bcrypt.compare(req.body.oldpwd, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    user.password = await bcrypt.hash(req.body.newpwd, 10);
  }
  await user.save();
  res.status(200).json({ 
    message: 'Profile successfully updated',
    updatedAt: user.updatedAt
  });
}

// Delete user
const deleteUserAndData = async (req, res) => {
  const userID = req.user.id;

  try {
    const user = await User.findById(userID).exec();
    if (!user) {
      return res.status(404).json({ message: `No user matches ID ${userID}` });
    }

    // if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    //   return res.status(403).json({ message: 'Forbidden: not your account' });
    // }

    const deletedUser = await User.deleteOne({ _id: userID });
    const deletedGalleries = await Gallery.deleteMany({ userId: userID });
    const deletedLooks = await Looks.deleteMany({ userId: userID });

    res.status(200).json({
      message: 'User and related data successfully deleted',
      deletedUser: deletedUser.deletedCount,
      deletedGalleries: deletedGalleries.deletedCount,
      deletedLooks: deletedLooks.deletedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export default { 
  getProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUserAndData
 }