'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static findByTelegramId(telegramId) {
      return this.findOne({
        where: {
          telegramId: telegramId
        }
      })
    }

    static findActiveByDay(day) {
      return this.findAll({
        where: {
          day: day,
          isActive: true
        }
      })
    }
  };
  Agent.init({
    telegramId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    nickname: DataTypes.STRING,
    day: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    lastQuestion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Agent',
    tableName: "agents",
  });
  return Agent;
};