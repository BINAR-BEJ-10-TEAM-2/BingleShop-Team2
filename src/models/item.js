const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Order, {
        as: 'orders',
        through: { model: models.OrderItem },
        foreignKey: 'item_id',
      });
    }
  }
  Item.init(
    {
      item_name: DataTypes.STRING,
      description: DataTypes.STRING,
      image_url: DataTypes.STRING,
      price: DataTypes.FLOAT,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Item',
    },
  );
  return Item;
};
