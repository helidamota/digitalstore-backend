const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductImage = sequelize.define('ProductImage', {
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
    }, {
        tableName: 'product_images',
        timestamps: true,
        underscored: true,
    });

    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
    };

    return ProductImage;
};
