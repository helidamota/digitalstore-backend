const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: config.app.env === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
});

// Import all models
const User = require('./User')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const ProductImage = require('./ProductImage')(sequelize, DataTypes);
const ProductOption = require('./ProductOption')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const ProductCategory = require('./ProductCategory')(sequelize, DataTypes);

// Define associations
if (ProductOption.associate) {
    ProductOption.associate(sequelize.models);
}

if (ProductImage.associate) {
    ProductImage.associate(sequelize.models);
}

if (Product.associate) {
    Product.associate(sequelize.models);
}

if (Category.associate) {
    Category.associate(sequelize.models);
}

if (ProductCategory.associate) {
    ProductCategory.associate(sequelize.models);
}

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
