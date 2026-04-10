'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Swipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Swipe.belongsTo(models.User, { foreignKey: 'brand_id', as: 'brand' });
      models.Swipe.belongsTo(models.User, { foreignKey: 'blogger_id', as: 'blogger' });
    }
  }
  Swipe.init({
    brand_id: DataTypes.INTEGER,
    blogger_id: DataTypes.INTEGER,
    direction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Swipe',
  });
  return Swipe;
};