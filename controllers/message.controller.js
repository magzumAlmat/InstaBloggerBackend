const { Message, Deal, Offer, Notification, Connection } = require('../models');
const notificationService = require('../services/notification.service');

exports.sendMessage = async (req, res) => {
  try {
    const { targetId, targetType } = req.body; // targetType: 'DEAL' or 'CONNECTION'
    const { content } = req.body;
    
    if (!content) return res.status(400).json({ message: 'Content is required' });

    let receiverId;
    if (targetType === 'DEAL') {
      const deal = await Deal.findByPk(targetId, { include: ['offer'] });
      if (!deal) return res.status(404).json({ message: 'Deal not found' });
      if (deal.blogger_id !== req.user.id && deal.offer.brand_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      receiverId = (deal.blogger_id === req.user.id) ? deal.offer.brand_id : deal.blogger_id;
      
      const message = await Message.create({ content, sender_id: req.user.id, deal_id: targetId });
      await Notification.create({ user_id: receiverId, message: `Новое сообщение в сделке: ${content.substring(0, 30)}...` });
      
      await notificationService.sendPushNotification(receiverId, 'Новое сообщение 💬', `В сделке: ${content.substring(0, 40)}...`, { dealId: targetId });
      
      return res.status(201).json(message);
    } else {
      const conn = await Connection.findByPk(targetId);
      if (!conn) return res.status(404).json({ message: 'Connection not found' });
      if (conn.brand_id !== req.user.id && conn.blogger_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      receiverId = (conn.brand_id === req.user.id) ? conn.blogger_id : conn.brand_id;
      
      const message = await Message.create({ content, sender_id: req.user.id, connection_id: targetId });
      await Notification.create({ user_id: receiverId, message: `Новое сообщение: ${content.substring(0, 30)}...` });
      
      await notificationService.sendPushNotification(receiverId, `Сообщение от @${req.user.ig_username} 💬`, content.substring(0, 50), { connectionId: targetId });
      
      return res.status(201).json(message);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByDeal = async (req, res) => {
  try {
    const { dealId } = req.params;
    const messages = await Message.findAll({
      where: { deal_id: dealId },
      include: ['sender'],
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const messages = await Message.findAll({
      where: { connection_id: connectionId },
      include: ['sender'],
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
