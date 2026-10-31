const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('product_categories', {
            product_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            category_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('product_categories');
    },
};
