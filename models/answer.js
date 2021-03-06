'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Answer.init({
    text: DataTypes.STRING,
    messageId: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    isRight: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: "answers",
    underscored: true
  });
  return Answer;
};