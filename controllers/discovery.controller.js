const { User, Swipe, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getBloggerStack = async (req, res) => {
  try {
    const brandId = req.user.id;

    // Get IDs of bloggers already swiped by this brand
    const swipedBloggerIds = await Swipe.findAll({
      where: { brand_id: brandId },
      attributes: ['blogger_id']
    }).then(swipes => swipes.map(s => s.blogger_id));

    // Find bloggers not in the swiped list
    const bloggers = await User.findAll({
      where: {
        role: 'BLOGGER',
        id: {
          [Op.notIn]: swipedBloggerIds.length > 0 ? swipedBloggerIds : [0] // Handle empty list
        }
      },
      attributes: ['id', 'email', 'ig_username', 'avatar_url', 'rating'],
      include: [{ association: 'portfolio', attributes: ['media_url', 'media_type'] }],
      limit: 10,
      order: sequelize.random() // Randomize the stack like Tinder
    });

    res.json(bloggers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.swipeBlogger = async (req, res) => {
  try {
    const { bloggerId, direction } = req.body; // direction: 'LIKE' or 'DISLIKE'
    const brandId = req.user.id;

    if (!['LIKE', 'DISLIKE'].includes(direction)) {
      return res.status(400).json({ message: 'Invalid direction' });
    }

    const swipe = await Swipe.create({
      brand_id: brandId,
      blogger_id: bloggerId,
      direction
    });

    // If LIKE, we could potentially auto-create a Deal or a "Match"
    // For now, we just record the swipe to filter the stack
    
    res.status(201).json({ message: `Swiped ${direction}`, swipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
