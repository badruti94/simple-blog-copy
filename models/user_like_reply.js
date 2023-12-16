'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_like_reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_like_reply.init({
    user_id: DataTypes.INTEGER,
    reply_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_like_reply',
  });
  return user_like_reply;
};