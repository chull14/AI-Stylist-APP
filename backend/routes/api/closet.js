import express from 'express';
import closetController from '../../controllers/main/closetController.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import upload from '../../middleware/uploadHandler.js';

const router = express.Router({ mergeParams: true });

// peth - /api/users/:userId/closet
router.route('/')
  .post(verifyJWT, verifyUser, upload.single('image'), closetController.uploadItem) // upload item to closet
  .get(verifyJWT, verifyUser, closetController.getCloset); // get whole closet

// path - /api/users/:userId/closet/:closetId
router.route('/:closetId')
  .get(verifyJWT, verifyUser, closetController.getClosetItem) // get one closet item
  .put(verifyJWT, verifyUser, closetController.updateItem) // update a closet item
  .delete(verifyJWT, verifyUser, closetController.deleteItem); // delete a closet item

export default router;