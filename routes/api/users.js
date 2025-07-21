import express from 'express';
import userController from '../../controllers/main/userController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';
import verifyJWT from '../../middleware/verifyJWT.js';

const router = express.Router();

router.route('/')
    .get(verifyJWT, userController.getProfile) // Get user profile
    .get(userController.getAllUsers) // Get all users

// /users/:id routes with verification 
// router.route('/:id')
//   .get(userController.getUser)
//   .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), userController.updateUser)
//   .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUserAndData);

router.route('/:id')
  .get(verifyJWT, userController.getUser) // Get specific user
  .put(verifyJWT,userController.updateUser) // Update user info
  .delete(userController.deleteUserAndData); // Delete user and user info

export default router;
