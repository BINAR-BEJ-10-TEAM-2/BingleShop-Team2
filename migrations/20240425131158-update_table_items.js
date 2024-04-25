'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Items', 'product_name', 'item_name');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Items', 'item_name', 'product_name');
  },
};
