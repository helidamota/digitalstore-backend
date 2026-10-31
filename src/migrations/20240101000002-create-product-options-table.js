const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('product_options', {
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
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            shape: {
                type: DataTypes.ENUM('square', 'circle'),
                allowNull: true,
                defaultValue: 'square',
            },
            radius: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            type: {
                type: DataTypes.ENUM('text', 'color'),
                allowNull: true,
                defaultValue: 'text',
            },
            values: {
                type: DataTypes.STRING(1000),
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
        await queryInterface.addIndex('product_options', ['product_id']);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('product_options');
    },
};
