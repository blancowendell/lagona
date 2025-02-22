'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_rider', 'mr_longitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
      after: 'mr_license_code' // Adjust this to place the column in the desired position
    });
    await queryInterface.addColumn('master_rider', 'mr_latitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
      after: 'mr_longitude' // Adjust this to place the column in the desired position
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_rider', 'mr_longitude');
    await queryInterface.removeColumn('master_rider', 'mr_latitude');
  }
};
