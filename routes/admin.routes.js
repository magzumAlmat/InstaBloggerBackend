const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateJWT, requireRole } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticateJWT, requireRole('ADMIN'), adminController.getDashboardStats);

module.exports = router;
