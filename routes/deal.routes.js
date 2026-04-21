const express = require('express');
const router = express.Router();
const dealController = require('../controllers/deal.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

// Blogger applies to an offer
router.post('/apply/:offerId', authenticateJWT, requireRole('BLOGGER'), dealController.applyForOffer);

// Get blogger's own deals
router.get('/my', authenticateJWT, requireRole('BLOGGER'), dealController.getMyDeals);

// Get brand's deals
router.get('/brand', authenticateJWT, requireRole('BRAND'), dealController.getBrandDeals);

// Brand accepts blogger
router.patch('/:id/accept', authenticateJWT, requireRole('BRAND'), dealController.acceptBlogger);

// Blogger submits report with screenshot
router.patch('/:id/report', authenticateJWT, requireRole('BLOGGER'), upload.single('screenshot'), dealController.submitReport);

// Brand completes deal
router.patch('/:id/complete', authenticateJWT, requireRole('BRAND'), dealController.completeDeal);

module.exports = router;
