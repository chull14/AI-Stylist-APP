import express from 'express';
import authController from '../../controllers/auth/authController.js';

const router = express.Router();

router.post('/login', authController.handleLogin);
router.post('/register', authController.handleNewUser);
router.get('/logout', authController.handleLogout);
router.get('/refresh', authController.handleRefreshToken);

export default router;