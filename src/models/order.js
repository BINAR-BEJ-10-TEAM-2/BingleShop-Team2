const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Item, {
        as: 'items',
        through: { model: models.OrderItem },
        foreignKey: 'order_id',
      });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      address_to: DataTypes.STRING,
      total_order_price: DataTypes.DECIMAL,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
