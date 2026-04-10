'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Deal.belongsTo(models.User, { foreignKey: 'blogger_id', as: 'blogger' });
      models.Deal.belongsTo(models.Offer, { foreignKey: 'offer_id', as: 'offer' });
      models.Deal.hasOne(models.Review, { foreignKey: 'deal_id', as: 'review' });
      models.Deal.hasMany(models.Message, { foreignKey: 'deal_id', as: 'messages' });
    }
  }
  Deal.init({
    status: DataTypes.STRING,
    report_link: DataTypes.STRING,
    report_screenshot_url: DataTypes.STRING,
    offer_id: DataTypes.INTEGER,
    blogger_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deal',
  });
  return Deal;
};