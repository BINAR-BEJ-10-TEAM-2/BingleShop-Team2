'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.User, { as: 'user', foreignKey: 'id', sourceKey: 'user_id' });
    }
  }
  Verification.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Verification',
  });
  return Verification;
};
