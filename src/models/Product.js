const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
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
    }, {
        tableName: 'products',
        timestamps: true,
    });

    Product.associate = (models) => {
        Product.hasMany(models.ProductImage, {
            foreignKey: 'product_id',
            as: 'images',
        });
        Product.hasMany(models.ProductOption, {
            foreignKey: 'product_id',
            as: 'options',
        });
        Product.belongsToMany(models.Category, {
            foreignKey: 'product_id',
            through: 'product_categories',
            as: 'categories',
        });
    };

    return Product;
};
