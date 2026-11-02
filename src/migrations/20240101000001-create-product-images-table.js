const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('product_images', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            product_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            enabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            path: {
                type: DataTypes.STRING(255),
                allowNull: false,
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

        // Create index for product_id to improve query performance
        await queryInterface.addIndex('product_images', ['product_id']);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('product_images');
    },
};
