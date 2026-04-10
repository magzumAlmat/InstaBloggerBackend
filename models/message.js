'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
      models.Message.belongsTo(models.Deal, { foreignKey: 'deal_id', as: 'deal' });
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    sender_id: DataTypes.INTEGER,
    deal_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};