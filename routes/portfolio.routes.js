const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

router.post('/upload', authenticateJWT, requireRole('BLOGGER'), upload.single('media'), portfolioController.uploadMedia);
router.get('/me', authenticateJWT, requireRole('BLOGGER'), portfolioController.getMyPortfolio);
router.delete('/:id', authenticateJWT, requireRole('BLOGGER'), portfolioController.deleteMedia);

module.exports = router;
