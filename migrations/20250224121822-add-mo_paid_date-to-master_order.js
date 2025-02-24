"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("master_order", "mo_paid_date", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "mo_payment_screenshots",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("master_order", "mo_paid_date");
  },
};
