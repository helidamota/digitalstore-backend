module.exports = (sequelize, DataTypes) => {
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
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'categories',
        timestamps: true,
        underscored: true,
    });

    Category.associate = (models) => {
        Category.belongsToMany(models.Product, {
            foreignKey: 'category_id',
            through: 'product_categories',
            as: 'products',
        });
    };

    return Category;
};
