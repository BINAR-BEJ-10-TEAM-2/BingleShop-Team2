'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
      await queryInterface.addColumn('Items', 'stock', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      await queryInterface.addColumn('Items', 'description', {
        type: Sequelize.STRING,
        allowNull: true,
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'image_url'),
      await queryInterface.removeColumn('Items', 'stock'),
      await queryInterface.removeColumn('Items', 'description');
  },
};
