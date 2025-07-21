import express from 'express';
import lookController from '../../controllers/main/lookController.js'
import verifyJWT from '../../middleware/verifyJWT.js';
import verifyLook from '../../middleware/verifyID/verifyLook.js';
import verifyUser from '../../middleware/verifyID/verifyUser.js';
import upload from '../../middleware/uploadHandler.js';

const router = express.Router();

// Get all looks
router.get('/:lookId', lookController.getAllLooks);

// create a single look
router.post('/:userId/looks', verifyJWT, upload.single('image'), lookController.createSingleLook);

// Update pin tags PUT

// Delete pin DELETE

export default router;