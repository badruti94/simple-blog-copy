'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.hasMany(models.user_like_comment, {
        as: 'user_like_comment',
        foreignKey: 'comment_id'
      })
      comment.hasMany(models.reply, {
        as: 'reply',
        foreignKey: 'comment_id'
      })
      comment.belongsTo(models.user, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  }
  comment.init({
    body: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};