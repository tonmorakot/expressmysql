'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Blog.belongsTo(models.User, {
        as: 'user',
        foreignKey: "id",
        sourceKey: "users_id",
      })
    }
  };
  Blog.init({
    title: DataTypes.STRING,
    users_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Blog',
    tableName: "blogs",
    timestamps: false,
  });
  return Blog;
};