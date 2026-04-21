const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connection.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.get('/requests', authenticateJWT, connectionController.getRequests);
router.get('/', authenticateJWT, connectionController.getAuthorized);
router.post('/:id/accept', authenticateJWT, connectionController.acceptRequest);

module.exports = router;
