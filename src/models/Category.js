const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
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
    }, {
        tableName: 'categories',
        timestamps: true,
    });

    return Category;
};
