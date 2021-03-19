'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
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
        select row_number() over(partition by q.day order by q.sort) as number, q.id, q.text, q.alias, q.media_file_path, q.media_file_type, q.verification_required, q.day, (
          select json_object_agg(id, text) from answers a where a.message_id = q.id
        ) as answers,  (
          select id from answers a where a.message_id = q.id and a.is_right is true
        ) as right_answer_id
        from messages q
        `, {type: sequelize.QueryTypes.SELECT});
    }

    static async findIdOfTheLastByDay(day) {
      const result = await sequelize.query(`
        select id
        from messages q
        where day = ${day}
        order by sort desc
        limit 1
        `, {type: sequelize.QueryTypes.SELECT, plain: true});
      return result.id
    }

    static findWithAnswersByDayGtNumber(day, fromMessageNumber, toMessageNumber, limit) {
      let sql = `
          select * from (select row_number() over(order by sort) as number, q.id, q.text, q.day, q.alias, q.media_file_type, q.media_file_path, q.verification_required, (
              select json_object_agg(id, text) from answers a where a.message_id = q.id
            ) as answers,  (
              select id from answers a where a.message_id = q.id and a.is_right is true
            ) as right_answer_id
            from messages q
            where day = ${day}
            order by sort) as t 
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
  Message.init({
    text: DataTypes.TEXT,
    day: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    mediaFilePath: DataTypes.STRING,
    mediaFileType: DataTypes.STRING,
    alias: DataTypes.STRING,
    verificationRequired: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
    tableName: "messages",
    underscored: true
  });
  return Message;
};