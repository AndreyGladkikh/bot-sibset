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

    static findAllWithQuestions() {
      return sequelize.query(`
        select dense_rank() over(partition by q.day order by q.priority) as "questionNumber", q.alias, q."verificationRequired", q.day, a.id, (
          select id from answers a where a."questionId" = q.id and a."isRight" is true
        ) as "rightAnswerId"
        from questions q
          left join answers a on q.id = a."questionId"
        `, {type: sequelize.QueryTypes.SELECT});
    }
  };
  Answer.init({
    text: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    isRight: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: "answers",
  });
  return Answer;
};