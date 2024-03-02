// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// - for the more info on one-to-many relationships see day-3 class video, @36:30

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "category_id",
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  /*foreignKey: "product_id", constraints: false*/

  through: {
    model: ProductTag,
    unique: false,
  },
  as: "random_alias"
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  /*foreignKey: "product_id", constraints: false*/

  through: {
    model: ProductTag,
    unique: false,
  },
  as: "random_alias"
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
