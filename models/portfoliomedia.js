'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PortfolioMedia.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  PortfolioMedia.init({
    user_id: DataTypes.INTEGER,
    media_url: DataTypes.STRING,
    media_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PortfolioMedia',
  });
  return PortfolioMedia;
};