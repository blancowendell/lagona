'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order_details_table', 'odt_extra_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "odt_product_id",
    });
    
    await queryInterface.addConstraint('order_details_table', {
      fields: ['odt_extra_id'],
      type: 'foreign key',
      name: 'fk_odt_extra_id',
      references: {
        table: 'menu_extras',
        field: 'me_extra_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('order_details_table', 'odt_combo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "odt_extra_id",
    });
    
    await queryInterface.addConstraint('order_details_table', {
      fields: ['odt_combo_id'],
      type: 'foreign key',
      name: 'fk_odt_combo_id',
      references: {
        table: 'menu_combo',
        field: 'mc_combo_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('order_details_table', 'odt_solo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "odt_combo_id",
    });
    
    await queryInterface.addConstraint('order_details_table', {
      fields: ['odt_solo_id'],
      type: 'foreign key',
      name: 'fk_odt_solo_id',
      references: {
        table: 'menu_solo',
        field: 'ms_solo_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });


    await queryInterface.addColumn('order_details_table', 'odt_item_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "odt_solo_id",
    });
    
    await queryInterface.addConstraint('order_details_table', {
      fields: ['odt_item_id'],
      type: 'foreign key',
      name: 'fk_odt_item_id',
      references: {
        table: 'menu_item',
        field: 'mi_item_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('order_details_table', 'fk_odt_extra_id');
    await queryInterface.removeColumn('order_details_table', 'odt_extra_id');
    await queryInterface.removeConstraint('order_details_table', 'fk_odt_combo_id');
    await queryInterface.removeColumn('order_details_table', 'odt_combo_id');
    await queryInterface.removeConstraint('order_details_table', 'fk_odt_solo_id');
    await queryInterface.removeColumn('order_details_table', 'odt_solo_id');
    await queryInterface.removeConstraint('order_details_table', 'fk_odt_item_id');
    await queryInterface.removeColumn('order_details_table', 'odt_item_id');
  }
};

