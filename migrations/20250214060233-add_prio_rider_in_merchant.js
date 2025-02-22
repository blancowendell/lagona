'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_merchant', 'mm_prio_rider', {
      type: Sequelize.INTEGER,
      references: {
        model: 'master_rider',
        key: 'mr_rider_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_merchant', 'mm_prio_rider');
  },
};
