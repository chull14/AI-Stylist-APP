import express from 'express';
import userController from '../../controllers/main/userController.js';
import ROLES_LIST from '../../config/roles_list.js';
// import verifyRoles from '../../middleware/verifyRoles.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';

const router = express.Router();

router.route('/:userId/profile').get(verifyJWT, verifyUser, userController.getProfile); // Get user profile
router.route('/all').get(userController.getAllUsers); // Get all users

// /users/:id routes with verification 
// router.route('/:id')
//   .get(userController.getUser)
//   .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), userController.updateUser)
//   .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUserAndData);

router.route('/:userId')
  .get(verifyJWT, verifyUser, userController.getUser) // Get specific user
  .put(verifyJWT, verifyUser, userController.updateUser) // Update user info
  .delete(verifyJWT, verifyUser, userController.deleteUserAndData); // Delete user and user info

export default router;
