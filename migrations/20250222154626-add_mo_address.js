'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_order', 'mo_address_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'customer_address', // Table being referenced
        key: 'ca_address_id', // Primary key in referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_order', 'mo_address_id');
  }
};
