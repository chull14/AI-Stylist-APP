import express from 'express';
import lookController from '../../controllers/main/lookController.js'
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyLook from '../../middleware/verifyID/verifyLook.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import upload from '../../middleware/uploadHandler.js';

const router = express.Router({ mergeParams: true });

// Get all looks
router.get('/:userId/looks', verifyJWT, verifyUser, lookController.getAllLooks);

// Get a single look
router.get('/:userId/looks/:lookId',  verifyJWT, verifyUser, verifyLook, lookController.getLook);

// create a single look
router.post('/:userId/looks', verifyJWT, verifyUser, upload.single('image'), lookController.createSingleLook);

// create up to 5 looks
router.post('/:userId/looks/batch', verifyJWT, verifyUser, upload.array('images', 5), lookController.createMultipleLooks);

// Update pin tags PUT
router.put('/:userId/looks/:lookId', verifyJWT, verifyUser, verifyLook, lookController.updateLook);

// Delete pin DELETE
router.delete('/:userId/looks/:lookId', verifyJWT, verifyUser, verifyLook, lookController.deleteLook);

export default router;