import express from 'express';
import galleryController from '../../controllers/main/galleryController.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import verifyGallery from '../../middleware/verifyID/verifyGallery.js';

const router = express.Router({ mergeParams: true });

router.route('/:userId/galleries')
    .get(verifyJWT, verifyUser, galleryController.getAllGalleries) // Get all user galleries
    .post(verifyJWT, verifyUser, galleryController.createGallery); // Create new gallery 

router.route('/:userId/galleries/:galleryId')
    .get(verifyJWT, verifyUser, verifyGallery, galleryController.getGallery) // Get specific gallery's looks
    .put(verifyJWT, verifyUser, verifyGallery, galleryController.updateGallery) // Update a gallery
    .delete(verifyJWT, verifyUser, verifyGallery, galleryController.deleteGallery); // Delete a gallery

export default router;
