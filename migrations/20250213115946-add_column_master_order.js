'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_order', 'mo_order_status', {
      type: Sequelize.STRING(50),
      allowNull: true, 
      after: 'mo_order_total' 
    });

    await queryInterface.addColumn('master_order', 'mo_rider_completed', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      references: {
        model: 'master_rider', 
        key: 'mr_rider_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'mo_order_status' 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_order', 'mo_order_status');
    await queryInterface.removeColumn('master_order', 'mo_rider_completed');
  }
};
