'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_like_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_like_comment.belongsTo(models.user,{
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  }
  user_like_comment.init({
    user_id: DataTypes.INTEGER,
    comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_like_comment',
  });
  return user_like_comment;
};