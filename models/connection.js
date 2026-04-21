'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static associate(models) {
      models.Connection.belongsTo(models.User, { foreignKey: 'brand_id', as: 'brand' });
      models.Connection.belongsTo(models.User, { foreignKey: 'blogger_id', as: 'blogger' });
    }
  }
  Connection.init({
    brand_id: DataTypes.INTEGER,
    blogger_id: DataTypes.INTEGER,
    brand_status: { type: DataTypes.STRING, defaultValue: 'NONE' }, // NONE, LIKE, DISLIKE
    blogger_status: { type: DataTypes.STRING, defaultValue: 'NONE' }, // NONE, LIKE, DISLIKE
    status: { type: DataTypes.STRING, defaultValue: 'PENDING' } // PENDING, AUTHORIZED
  }, {
    sequelize,
    modelName: 'Connection',
  });
  return Connection;
};
