const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('products', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            enabled: {
                type: DataTypes.TINYINT(1),
                allowNull: true,
                defaultValue: 0,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            use_in_menu: {
                type: DataTypes.TINYINT(1),
                allowNull: true,
                defaultValue: 0,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            description: {
                type: DataTypes.STRING(1000),
                allowNull: true,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            price_with_discount: {
                type: DataTypes.FLOAT,
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
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('products');
    },
};
