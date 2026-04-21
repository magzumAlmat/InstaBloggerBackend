const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discovery.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');

// Brands discover bloggers
router.get('/bloggers', authenticateJWT, requireRole('BRAND'), discoveryController.getBloggerStack);

// Bloggers discover brands
router.get('/brands', authenticateJWT, requireRole('BLOGGER'), discoveryController.getBrandStack);

// Both roles can swipe
router.post('/swipe', authenticateJWT, discoveryController.swipe);

// View portfolio
router.get('/blogger/:id', authenticateJWT, discoveryController.getBloggerById);

module.exports = router;
