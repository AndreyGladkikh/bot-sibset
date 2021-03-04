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

    static getByDay(day) {
      return sequelize.query(`
        select q.id as id, q.text as text, (
          select json_object_agg(sort, text) from answers a where a."questionId" = q.id
        ) as answers,  (
                 select sort from answers a where a."questionId" = q.id and a.right is true
               ) as right_answer_id
        from questions q
        where day = ${day}
        order by sort
        `, {
        model: this,
        mapToModel: true
      });
    }
  };
  Question.init({
    text: DataTypes.TEXT,
    day: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    alias: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
    tableName: "questions",
  });
  return Question;
};