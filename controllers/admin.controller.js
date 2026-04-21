const { User, Connection, Deal, Offer, Swipe, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Roles distribution
    const totalBloggers = await User.count({ where: { role: 'BLOGGER' } });
    const totalBrands = await User.count({ where: { role: 'BRAND' } });

    // 2. Connections distribution
    const totalConnections = await Connection.count();
    const authorizedConnections = await Connection.count({ where: { status: 'AUTHORIZED' } });

    // 3. Deals analytics
    const totalDeals = await Deal.count();
    const completedDeals = await Deal.count({ where: { status: 'COMPLETED' } });
    
    // 4. Category distribution (across all users)
    const categoryDistribution = await User.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { category: { [Op.not]: null } },
      group: ['category'],
      raw: true
    });

    // 5. Offers / Financials (assuming Offer has price / budget field)
    // If not, we just count offers
    const totalOffers = await Offer.count();
    const activeOffers = await Offer.count({ where: { is_active: true } });

    res.json({
      users: { bloggers: totalBloggers, brands: totalBrands, total: totalBloggers + totalBrands },
      connections: { total: totalConnections, authorized: authorizedConnections },
      deals: { total: totalDeals, completed: completedDeals },
      categories: categoryDistribution,
      offers: { total: totalOffers, active: activeOffers }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
