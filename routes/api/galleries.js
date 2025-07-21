import express from 'express';
import galleryController from '../../controllers/main/galleryController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(galleryController.getAllGalleries) // Get all user galleries
    .post(galleryController.createGallery); // Create new gallery 

router.route('/:galleryId')
    .get(galleryController.getGallery) // Get specific gallery's looks
    .put(galleryController.updateGallery) // Update a gallery
    .delete(galleryController.deleteGallery); // Delete a gallery

export default router;
