const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateJWT, authController.getMe);
router.patch('/profile', authenticateJWT, authController.updateProfile);
router.post('/push-token', authenticateJWT, authController.updatePushToken);
router.post('/avatar', authenticateJWT, upload.single('avatar'), authController.uploadAvatar);

module.exports = router;
