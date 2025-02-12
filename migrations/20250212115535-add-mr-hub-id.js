"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("master_rider", "mr_hub_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "mr_rider_code",
    });

    await queryInterface.addConstraint("master_rider", {
      fields: ["mr_hub_id"],
      type: "foreign key",
      name: "fk_mr_hub_id",
      references: {
        table: "master_hub_station",
        field: "msh_hub_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("master_rider", "fk_mr_hub_id");
    await queryInterface.removeColumn("master_rider", "mr_hub_id");
  },
};
