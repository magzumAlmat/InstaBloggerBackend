const { Message, Deal, Offer, Notification } = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { content } = req.body;
    
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const deal = await Deal.findByPk(dealId, { include: ['offer'] });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    // Check if user is part of the deal
    const isBlogger = deal.blogger_id === req.user.id;
    const isBrand = deal.offer.brand_id === req.user.id;

    if (!isBlogger && !isBrand) {
      return res.status(403).json({ message: 'You are not part of this deal' });
    }

    const message = await Message.create({
      content,
      sender_id: req.user.id,
      deal_id: dealId
    });

    // Notify the other party
    const receiverId = isBlogger ? deal.offer.brand_id : deal.blogger_id;
    await Notification.create({
      user_id: receiverId,
      message: `New message in deal #${dealId}: "${content.substring(0, 30)}..."`
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { dealId } = req.params;
    const deal = await Deal.findByPk(dealId, { include: ['offer'] });
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    
    if (deal.blogger_id !== req.user.id && deal.offer.brand_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not part of this deal' });
    }

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
