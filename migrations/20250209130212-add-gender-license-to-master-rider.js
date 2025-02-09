'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("master_rider", "mr_gender", {
      type: Sequelize.STRING(10), // Can store values like 'Male', 'Female', 'Other'
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("master_rider", "mr_license_code", {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("master_rider", "mr_gender");
    await queryInterface.removeColumn("master_rider", "mr_license_code");
  },
};