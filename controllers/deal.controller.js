const { Deal, Offer, Notification, User } = require('../models');

exports.applyForOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findByPk(offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    
    const deal = await Deal.create({
      offer_id: offerId,
      blogger_id: req.user.id,
      status: 'REQUESTED'
    });
    
    // Notify Brand
    await Notification.create({
      user_id: offer.brand_id,
      message: 'New blogger applied for your offer: ' + offer.title
    });
    
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptBlogger = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id, { include: ['offer'] });
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.offer.brand_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this offer' });
    }
    
    deal.status = 'ACCEPTED';
    await deal.save();
    
    // Notify Blogger
    await Notification.create({
      user_id: deal.blogger_id,
      message: 'Your application was ACCEPTED for offer: ' + deal.offer.title
    });

    res.json({ message: 'Blogger accepted', deal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { report_link } = req.body;
    const deal = await Deal.findByPk(id, { include: ['offer'] });
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.blogger_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this deal' });
    }
    
    deal.status = 'REPORTED';
    if (report_link) deal.report_link = report_link;
    if (req.file) deal.report_screenshot_url = '/uploads/' + req.file.filename;
    
    await deal.save();
    
    // Notify Brand
    await Notification.create({
      user_id: deal.offer.brand_id,
      message: 'Blogger submitted a report for your barter: ' + deal.offer.title
    });

    res.json({ message: 'Report submitted', deal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id, { include: ['offer'] });
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.offer.brand_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this deal' });
    }
    
    deal.status = 'COMPLETED';
    await deal.save();
    
    res.json({ message: 'Deal completed', deal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyDeals = async (req, res) => {
  try {
    const { status } = req.query;
    let where = { blogger_id: req.user.id };
    if (status) {
      where.status = status;
    }
    const deals = await Deal.findAll({
      where,
      include: [{ model: Offer, as: 'offer', include: [{ model: User, as: 'brand', attributes: ['id', 'ig_username'] }] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrandDeals = async (req, res) => {
  try {
    const offers = await Offer.findAll({ where: { brand_id: req.user.id }, attributes: ['id'] });
    const offerIds = offers.map(o => o.id);

    const deals = await Deal.findAll({
      where: { offer_id: offerIds },
      include: [
        { model: Offer, as: 'offer', attributes: ['id', 'title', 'category'] },
        { model: User, as: 'blogger', attributes: ['id', 'ig_username', 'avatar_url', 'rating'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
