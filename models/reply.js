'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reply.hasMany(models.user_like_reply, {
        as: 'user_like_reply',
        foreignKey: 'reply_id'
      })
      reply.belongsTo(models.user, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  }
  reply.init({
    body: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'reply',
  });
  return reply;
};