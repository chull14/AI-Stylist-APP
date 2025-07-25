import express from 'express';
import galleryController from '../../controllers/main/galleryController.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import verifyGallery from '../../middleware/verifyID/verifyGallery.js';

const router = express.Router({ mergeParams: true });

// path - /api/users/:userId/galleries
router.route('/')
    .get(verifyJWT, verifyUser, galleryController.getAllGalleries) // get all user galleries
    .post(verifyJWT, verifyUser, galleryController.createGallery); // create a new gallery 

// path - /api/users/:userId/galleries/:galleryId
router.route('/:galleryId')
    .get(verifyJWT, verifyUser, verifyGallery, galleryController.getGallery) // get a gallery look
    .put(verifyJWT, verifyUser, verifyGallery, galleryController.updateGallery) // update a gallery
    .delete(verifyJWT, verifyUser, verifyGallery, galleryController.deleteGallery); // delete a gallery

export default router;
