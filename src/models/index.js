const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: config.app.env === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
    },
});

// Import all models and register them with aliases
const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const ProductImage = require('./ProductImage')(sequelize);
const ProductOption = require('./ProductOption')(sequelize);
const Category = require('./Category')(sequelize);
const ProductCategory = require('./ProductCategory')(sequelize);

// Register models with aliases for associations
sequelize.models.User = User;
sequelize.models.Product = Product;
sequelize.models.ProductImage = ProductImage;
sequelize.models.ProductOption = ProductOption;
sequelize.models.Category = Category;
sequelize.models.ProductCategory = ProductCategory;

// Define associations
if (User.associate) {
    User.associate(sequelize.models);
}

if (Product.associate) {
    Product.associate(sequelize.models);
}

if (ProductImage.associate) {
    ProductImage.associate(sequelize.models);
}

if (ProductOption.associate) {
    ProductOption.associate(sequelize.models);
}

if (Category.associate) {
    Category.associate(sequelize.models);
}

if (ProductCategory.associate) {
    ProductCategory.associate(sequelize.models);
}

// Export models and sequelize
module.exports = {
    sequelize,
    Sequelize,
    User,
    Product,
    ProductImage,
    ProductOption,
    Category,
    ProductCategory,
};
