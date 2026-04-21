const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/', authenticateJWT, messageController.sendMessage);
router.get('/deal/:dealId', authenticateJWT, messageController.getMessagesByDeal);
router.get('/connection/:connectionId', authenticateJWT, messageController.getMessagesByConnection);

module.exports = router;
