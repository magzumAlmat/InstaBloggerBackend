const { Offer, User } = require('../models');

exports.getOffers = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = { status: 'OPEN' };
    if (category) {
      where.category = category;
    }
    
    // city filter not included because field doesn't exist on model yet.

    const offers = await Offer.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'brand', attributes: ['id', 'ig_username', 'avatar_url', 'rating'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { title, description, category, product_value, requirements, image_url } = req.body;
    
    const offer = await Offer.create({
      title,
      description,
      category,
      product_value,
      requirements,
      image_url,
      status: 'OPEN',
      brand_id: req.user.id
    });
    
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [{ model: User, as: 'brand', attributes: ['id', 'email', 'ig_username', 'avatar_url', 'rating'] }]
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
