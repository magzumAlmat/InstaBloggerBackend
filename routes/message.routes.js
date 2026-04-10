const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/:dealId', authenticateJWT, messageController.sendMessage);
router.get('/:dealId', authenticateJWT, messageController.getMessages);

module.exports = router;
