import express from 'express';
import userController from '../../controllers/main/userController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';

const router = express.Router();

//path - /api/users/all
router.route('/all').get(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.getAllUsers); // Get all users

// path - /api/users/profile
router.route('/profile').get(verifyJWT, verifyUser, userController.getProfile); // Get user profile

// path - /api/users/:userId
router.route('/')
  .get(verifyJWT, verifyUser, userController.getUser) // Get specific user
  .put(verifyJWT, verifyUser, userController.updateUser) // Update user info
  .delete(verifyJWT, verifyUser, userController.deleteUserAndData); // Delete user and user info

export default router;
