'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Offer, { foreignKey: 'brand_id', as: 'offers' });
      models.User.hasMany(models.Deal, { foreignKey: 'blogger_id', as: 'deals' });
      models.User.hasMany(models.Review, { foreignKey: 'from_user_id', as: 'reviewsGiven' });
      models.User.hasMany(models.Review, { foreignKey: 'to_user_id', as: 'reviewsReceived' });
      models.User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
      models.User.hasMany(models.PortfolioMedia, { foreignKey: 'user_id', as: 'portfolio' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    ig_username: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    is_verified: DataTypes.BOOLEAN,
    bio: DataTypes.TEXT,

    // ── Instagram metrics (for bloggers) ──
    followers_count: DataTypes.INTEGER,          // Количество подписчиков
    stories_views_percent: DataTypes.FLOAT,      // % подписчиков, которые смотрят сторис
    reels_views_percent: DataTypes.FLOAT,        // % просмотров рилсов
    likes_percent: DataTypes.FLOAT,              // % лайков от подписчиков
    reach: DataTypes.INTEGER,                    // Охват — кол-во уникальных людей, увидевших контент
    impressions: DataTypes.INTEGER,              // Просмотры — общее кол-во просмотров (вкл. повторные)
    engagement_rate: DataTypes.FLOAT,            // Взаимодействие — % (нажали, зашли, подписались, перешли)
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};