import express from 'express';
import lookController from '../../controllers/main/lookController.js'
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyLook from '../../middleware/verifyID/verifyLook.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import verifyGallery from '../../middleware/verifyID/verifyGallery.js';
import upload from '../../middleware/uploadHandler.js';

const router = express.Router();

// path - /:userId/looks
router.route('/:userId/looks')
  .get(verifyJWT, verifyUser, lookController.getAllLooks) // get all user looks
  .post(verifyJWT, verifyUser, upload.single('image'), lookController.createSingleLook); // create a single look

// path - /:userId/looks/:lookId
router.route('/:userId/looks/:lookId')
  .get(verifyJWT, verifyUser, verifyLook, lookController.getLook) // get specific look
  .put(verifyJWT, verifyUser, verifyLook, lookController.updateLook) // update a look
  .delete(verifyJWT, verifyUser, verifyLook, lookController.deleteLook); // delete a look

// create up to 5 looks
router.post('/:userId/looks/batch', verifyJWT, verifyUser, upload.array('images', 5), lookController.createMultipleLooks);

// Add a look to a gallery
router.patch('/:userId/looks/:lookId/galleries/:galleryId', verifyJWT, verifyUser, verifyLook, verifyGallery, lookController.addLookToGallery);

export default router;