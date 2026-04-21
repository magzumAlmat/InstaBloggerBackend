const { Connection, User, Message } = require('../models');
const notificationService = require('../services/notification.service');

exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let connections;
    if (role === 'BRAND') {
      connections = await Connection.findAll({
        where: { brand_id: userId, brand_status: 'NONE', blogger_status: 'LIKE' },
        include: [{ model: User, as: 'blogger', attributes: ['id', 'ig_username', 'avatar_url', 'category', 'rating'] }]
      });
    } else {
      connections = await Connection.findAll({
        where: { blogger_id: userId, blogger_status: 'NONE', brand_status: 'LIKE' },
        include: [{ model: User, as: 'brand', attributes: ['id', 'ig_username', 'avatar_url', 'category', 'rating'] }]
      });
    }

    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAuthorized = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let connections;
    if (role === 'BRAND') {
      connections = await Connection.findAll({
        where: { brand_id: userId, status: 'AUTHORIZED' },
        include: [{ model: User, as: 'blogger', attributes: ['id', 'ig_username', 'avatar_url', 'category', 'rating'] }]
      });
    } else {
      connections = await Connection.findAll({
        where: { blogger_id: userId, status: 'AUTHORIZED' },
        include: [{ model: User, as: 'brand', attributes: ['id', 'ig_username', 'avatar_url', 'category', 'rating'] }]
      });
    }

    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    const connection = await Connection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ message: 'Request not found' });

    if (role === 'BRAND' && connection.brand_id !== userId) return res.status(403).json({ message: 'Forbidden' });
    if (role === 'BLOGGER' && connection.blogger_id !== userId) return res.status(403).json({ message: 'Forbidden' });

    if (role === 'BRAND') connection.brand_status = 'LIKE';
    if (role === 'BLOGGER') connection.blogger_status = 'LIKE';

    connection.status = 'AUTHORIZED';
    await connection.save();

    // Push Notify
    const otherMemberId = (role === 'BRAND') ? connection.blogger_id : connection.brand_id;
    await notificationService.sendPushNotification(otherMemberId, 'Ваш запрос принят! 🤝', 'С вами готовы сотрудничать, чат открыт.');

    res.json({ message: 'Authorized successfully', connection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
