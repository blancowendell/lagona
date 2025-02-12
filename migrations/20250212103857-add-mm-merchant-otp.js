'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('master_merchant', 'mm_merchant_otp', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'mm_password',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('master_merchant', 'mm_merchant_otp');
  }
};
