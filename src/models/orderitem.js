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
      this.belongsTo(models.Order, {
        as: 'orders',
        through: { model: models.Order },
        foreignKey: 'order_id',
      });
      this.belongsTo(models.Item, {
        as: 'items',
        through: { model: models.Item },
        foreignKey: 'item_id',
      });
    }
  }
  OrderItem.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
        }},
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    },
  );
  return OrderItem;
};
