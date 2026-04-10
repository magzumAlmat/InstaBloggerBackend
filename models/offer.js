'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Offer.belongsTo(models.User, { foreignKey: 'brand_id', as: 'brand' });
      models.Offer.hasMany(models.Deal, { foreignKey: 'offer_id', as: 'deals' });
    }
  }
  Offer.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    product_value: DataTypes.INTEGER,
    requirements: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    status: DataTypes.STRING,
    brand_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};