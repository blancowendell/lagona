'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_details', {
      od_details_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      od_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_order', // Name of the referenced table
          key: 'mo_order_id' // Foreign key reference
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      od_order_category: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      od_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      od_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      od_status: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      od_create_date: {
        type: Sequelize.DATE, 
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_details');
  }
};
