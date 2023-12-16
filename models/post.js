'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.belongsTo(models.user, {
        as: 'user',
        foreignKey: 'user_id'
      })
      post.hasMany(models.user_like_post, {
        as: 'user_like_post',
        foreignKey: 'post_id'
      })
      post.hasMany(models.comment, {
        as: 'comment',
        foreignKey: 'post_id'
      })
    }
  }
  post.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    body: DataTypes.STRING,
    view: DataTypes.INTEGER,
    publish: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};