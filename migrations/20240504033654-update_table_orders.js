'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'total_order_price', {
      type: Sequelize.DECIMAL,
    });
    await queryInterface.addColumn('Orders', 'user_id', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn('Orders', 'quantity');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'total_order_price');
    await queryInterface.removeColumn('Orders', 'user_id');
    await queryInterface.addColumn('Orders', 'quantity', {
      type: Sequelize.INTEGER,
    });
  },
};
