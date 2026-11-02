const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductOption = sequelize.define('ProductOption', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
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
    }, {
        tableName: 'product_options',
        timestamps: true,
        underscored: true,
    });

    ProductOption.associate = (models) => {
        ProductOption.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
    };

    return ProductOption;
};
