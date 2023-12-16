'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.post, {
        through: 'user_save_posts',
        as: 'posts',
        foreignKey: 'user_id',
        otherKey: 'post_id'
      })
    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};