'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Review.belongsTo(models.Deal, { foreignKey: 'deal_id', as: 'deal' });
      models.Review.belongsTo(models.User, { foreignKey: 'from_user_id', as: 'author' });
      models.Review.belongsTo(models.User, { foreignKey: 'to_user_id', as: 'recipient' });
    }
  }
  Review.init({
    stars: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    deal_id: DataTypes.INTEGER,
    from_user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};