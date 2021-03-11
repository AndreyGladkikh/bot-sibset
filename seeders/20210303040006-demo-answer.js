'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('answers', [{
      text: 'Окей, мне понятно',
      questionId: 1,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Поделиться контактом',
      questionId: 2,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Хорошо',
      questionId: 3,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Что дальше?',
      questionId: 4,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Подключением клиентов',
      questionId: 5,
      priority: 1,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Ремонтом оборудования',
      questionId: 5,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Продажей услуг компании',
      questionId: 5,
      priority: 3,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Кемеровская, Новосибирская области, Алтайский и Красноярский край',
      questionId: 6,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Новосибирская области, Алтайский, Краснодарский, Красноярский край',
      questionId: 6,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Новосибирская, Томская область, Алтайский и Красноярский край',
      questionId: 6,
      priority: 3,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет',
      questionId: 7,
      priority: 1,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет и сотовая связь',
      questionId: 7,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет и IP TV',
      questionId: 7,
      priority: 3,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Окей, все ясно',
      questionId: 8,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'С этим понятно, давайте дальше',
      questionId: 9,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Окей, что еще мне нужно знать?',
      questionId: 10,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Доступ в интернет',
      questionId: 11,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'IP Адрес',
      questionId: 11,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Часть витой пары проводов',
      questionId: 11,
      priority: 3,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Ничем',
      questionId: 12,
      priority: 1,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Есть запись каналов',
      questionId: 12,
      priority: 2,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'IP TV смотреть можно только на телевизоре',
      questionId: 12,
      priority: 3,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Не требует дополнительного оборудования',
      questionId: 13,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Нет проводов',
      questionId: 13,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Есть Full HD качество',
      questionId: 13,
      priority: 3,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Да',
      questionId: 14,
      priority: 1,
      isRight: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Нет',
      questionId: 14,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Не устраивает доход',
      questionId: 15,
      priority: 1,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Не интересен функционал',
      questionId: 15,
      priority: 2,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Другое',
      questionId: 15,
      priority: 3,
      isRight: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    }], {});

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
