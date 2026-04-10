const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discovery.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');

// Brands discover bloggers
router.get('/bloggers', authenticateJWT, requireRole('BRAND'), discoveryController.getBloggerStack);
router.post('/swipe', authenticateJWT, requireRole('BRAND'), discoveryController.swipeBlogger);

module.exports = router;
