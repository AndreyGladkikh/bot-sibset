'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static findAllWithAnswers() {
      return sequelize.query(`
        select row_number() over(partition by q.day order by q.priority) as number, q.id, q.text, q.alias, q."isTest", q."mediaFile", q."mediaType", q."verificationRequired", q.day, (
          select json_object_agg(id, text) from answers a where a."questionId" = q.id
        ) as answers,  (
          select id from answers a where a."questionId" = q.id and a."isRight" is true
        ) as "rightAnswerId"
        from questions q
        `, {type: sequelize.QueryTypes.SELECT});
    }

    static async findIdOfTheLastByDay(day) {
      const result = await sequelize.query(`
        select id
        from questions q
        where day = ${day}
        order by priority desc
        limit 1
        `, {type: sequelize.QueryTypes.SELECT, plain: true});
      return result.id
    }

    static findWithAnswersByDayGtNumber(day, fromMessageNumber, toMessageNumber, limit) {
      let sql = `
          select * from (select row_number() over(order by priority) as number, q.id, q.text, q.day, q.alias, q."isTest", q."mediaType", q."mediaFile", q."verificationRequired", (
              select json_object_agg(id, text) from answers a where a."questionId" = q.id
            ) as answers,  (
              select id from answers a where a."questionId" = q.id and a."isRight" is true
            ) as "rightAnswerId"
            from questions q
            where day = ${day}
            order by priority) as t 
        `
      if(fromMessageNumber && toMessageNumber) {
        sql += `where t.number >= ${fromMessageNumber} and t.number <= ${toMessageNumber} `
      } else if(fromMessageNumber) {
        sql += `where t.number >= ${fromMessageNumber} `
      } else if(toMessageNumber) {
        sql += `where t.number <= ${toMessageNumber} `
      }
      if(limit) {
        sql += `limit ${limit} `
      }
      return sequelize.query(sql, {type: sequelize.QueryTypes.SELECT});
    }
  };
  Question.init({
    text: DataTypes.TEXT,
    day: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    isTest: DataTypes.BOOLEAN,
    mediaFile: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
    tableName: "questions",
    underscored: true
  });
  return Question;
};