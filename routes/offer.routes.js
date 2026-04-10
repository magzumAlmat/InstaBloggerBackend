const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offer.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');

router.get('/', offerController.getOffers);
router.get('/:id', offerController.getOfferById);

// Protected Brand routes
router.post('/', authenticateJWT, requireRole('BRAND'), offerController.createOffer);

module.exports = router;
