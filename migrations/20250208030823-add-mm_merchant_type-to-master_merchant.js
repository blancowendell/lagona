'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_merchant', 'mm_merchant_type', {
      type: Sequelize.STRING(255),
      after: 'mm_merchant_code', // Place the new column after 'mm_merchant_code'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_merchant', 'mm_merchant_type');
  },
};
