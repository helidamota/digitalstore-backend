const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductCategory = sequelize.define('ProductCategory', {
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
        },
    }, {
        tableName: 'product_categories',
        timestamps: true,
        underscored: true,
    });

    ProductCategory.associate = (models) => {
        ProductCategory.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
        ProductCategory.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });
    };

    return ProductCategory;
};
