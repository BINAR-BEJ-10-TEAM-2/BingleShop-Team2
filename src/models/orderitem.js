'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Product, {
        as: 'Items',
        through: { model: models.OrderItem },
        foreignKey: 'order_id',
      });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      quantity: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    },
  );
  return OrderItem;
};
