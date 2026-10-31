const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('categories', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
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
        await queryInterface.dropTable('categories');
    },
};
