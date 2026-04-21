const { User, Connection, sequelize } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('../services/notification.service');

exports.getBloggerStack = async (req, res) => {
  try {
    const brandId = req.user.id;
    const { category } = req.query;

    const connections = await Connection.findAll({ where: { brand_id: brandId } });
    const swipedIds = connections.filter(c => c.brand_status !== 'NONE').map(c => c.blogger_id);

    const whereClause = {
      role: 'BLOGGER',
      id: { [Op.notIn]: swipedIds.length > 0 ? swipedIds : [0] }
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    const bloggers = await User.findAll({
      where: whereClause,
      attributes: ['id', 'email', 'ig_username', 'avatar_url', 'category', 'rating', 'bio', 'followers_count', 'stories_views_percent', 'reels_views_percent', 'likes_percent', 'reach', 'impressions', 'engagement_rate'],
      include: [{ association: 'portfolio', attributes: ['media_url', 'media_type', 'title', 'description'] }],
      limit: 10,
      order: sequelize.random()
    });

    res.json(bloggers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrandStack = async (req, res) => {
  try {
    const bloggerId = req.user.id;
    const { category } = req.query;

    const connections = await Connection.findAll({ where: { blogger_id: bloggerId } });
    const swipedIds = connections.filter(c => c.blogger_status !== 'NONE').map(c => c.brand_id);

    const whereClause = {
      role: 'BRAND',
      id: { [Op.notIn]: swipedIds.length > 0 ? swipedIds : [0] }
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    const brands = await User.findAll({
      where: whereClause,
      attributes: ['id', 'email', 'ig_username', 'avatar_url', 'category', 'rating', 'bio'],
      limit: 10,
      order: sequelize.random()
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.swipe = async (req, res) => {
  try {
    const { targetId, direction, role } = req.body; 
    // role is 'BRAND' if brand is swiping, 'BLOGGER' if blogger is swiping
    const initiatorId = req.user.id;
    
    let brandId, bloggerId;
    if (role === 'BRAND') {
      brandId = initiatorId;
      bloggerId = targetId;
    } else {
      brandId = targetId;
      bloggerId = initiatorId;
    }

    let connection = await Connection.findOne({ where: { brand_id: brandId, blogger_id: bloggerId } });
    if (!connection) {
      connection = await Connection.create({ brand_id: brandId, blogger_id: bloggerId });
    }

    if (role === 'BRAND') {
      connection.brand_status = direction;
    } else {
      connection.blogger_status = direction;
    }

    // Check for mutual like
    let isMatch = false;
    if (connection.brand_status === 'LIKE' && connection.blogger_status === 'LIKE') {
      connection.status = 'AUTHORIZED';
      isMatch = true;
    }

    await connection.save();

    // Push Notifications
    if (direction === 'LIKE') {
      try {
        if (isMatch) {
           await notificationService.sendPushNotification(targetId, 'Взаимное рукопожатие! 🤝', 'У вас новый мэтч, можно начинать чат.');
           await notificationService.sendPushNotification(initiatorId, 'Успешный мэтч! ✨', 'Партнер принял ваш запрос.');
        } else {
           await notificationService.sendPushNotification(targetId, 'Новый запрос 🔔', 'Кто-то хочет с вами сотрудничать.');
        }
      } catch (err) { console.error('Push error:', err); }
    }

    res.json({ message: 'Swiped successfully', match: isMatch, connection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBloggerById = async (req, res) => {
  try {
    const blogger = await User.findOne({
      where: { id: req.params.id, role: 'BLOGGER' },
      attributes: { exclude: ['password'] },
      include: [{ association: 'portfolio' }]
    });
    if (!blogger) return res.status(404).json({ message: 'Блогер не найден' });
    res.json(blogger);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке профиля' });
  }
};
