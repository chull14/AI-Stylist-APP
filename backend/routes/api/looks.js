import express from 'express';
import lookController from '../../controllers/main/lookController.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyLook from '../../middleware/verifyID/verifyLook.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import verifyGallery from '../../middleware/verifyID/verifyGallery.js';
import upload from '../../middleware/uploadHandler.js';

const router = express.Router({ mergeParams: true });

// path - /api/users/:userId/looks
router.route('/')
  .get(verifyJWT, verifyUser, lookController.getAllLooks) // get all user looks
  .post(verifyJWT, verifyUser, upload.single('image'), lookController.createSingleLook); // create a single look

// IMPORTANT: These specific routes MUST come before /:lookId routes
// path - /api/users/:userId/looks/saved
router.get('/saved', verifyJWT, verifyUser, lookController.getSavedLooks); // get user's saved looks

// path - /api/users/:userId/looks/batch
router.post('/batch', verifyJWT, verifyUser, upload.array('images', 5), lookController.createMultipleLooks); // create up to 5 looks

// path - /api/users/:userId/looks/:lookId
router.route('/:lookId')
  .get(verifyJWT, verifyUser, verifyLook, lookController.getLook) // get specific look
  .put(verifyJWT, verifyUser, verifyLook, lookController.updateLook) // update a look
  .delete(verifyJWT, verifyUser, verifyLook, lookController.deleteLook); // delete a look

// path - /api/users/:userId/looks/:lookId/like
router.patch('/:lookId/like', verifyJWT, verifyUser, verifyLook, lookController.toggleLikeLook); // like/unlike and save/unsave a look

// path - /api/users/:userId/looks/:lookId/galleries/:galleryId
router.patch('/:lookId/galleries/:galleryId', verifyJWT, verifyUser, verifyLook, verifyGallery, lookController.addLookToGallery); // Add a look to a gallery

export default router;