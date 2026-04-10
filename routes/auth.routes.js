const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateJWT, authController.getMe);
router.patch('/profile', authenticateJWT, authController.updateProfile);

module.exports = router;
