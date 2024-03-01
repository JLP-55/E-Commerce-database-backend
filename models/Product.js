// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      // Needs to validate the value is a decimal.
      // Also, the documentation states that "type: DataTypes.DECIMAL(11,10)" whatever that means.
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Sets a default value
      // @Default(10),
      // Needs to validate the value is numeric
    },
    category_id: {
      type: DataTypes.INTEGER,
      referneces: {
        model: "category",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
