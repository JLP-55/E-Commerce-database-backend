// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// - for the more info on one-to-many relationships see day-3 class video, @36:30

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "CASCADE"
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
  // onDelete: "CASCADE"
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  foreignKey: "product_id",

  through: {
    model: ProductTag,
    // unique: false
  },
  // as: "alias"
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  foreignKey: "tag_id",

  // through: {
    through: ProductTag,
    // unique: false
  // },
  // as: "alias"
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
