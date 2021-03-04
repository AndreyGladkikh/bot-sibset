'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('answers', [{
      text: 'Окей, мне понятно',
      questionId: 1,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Поделиться контактом',
      questionId: 2,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Не делиться контактом',
      questionId: 2,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Хорошо',
      questionId: 3,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Что дальше?',
      questionId: 4,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Подключением клиентов',
      questionId: 5,
      sort: 1,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Ремонтом оборудования',
      questionId: 5,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Продажей услуг компании',
      questionId: 5,
      sort: 3,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Кемеровская, Новосибирская области, Алтайский и Красноярский край',
      questionId: 6,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Новосибирская области, Алтайский, Краснодарский, Красноярский край',
      questionId: 6,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Новосибирская, Томская область, Алтайский и Красноярский край',
      questionId: 6,
      sort: 3,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет',
      questionId: 7,
      sort: 1,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет и сотовая связь',
      questionId: 7,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Интернет и IP TV',
      questionId: 7,
      sort: 3,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Окей, все ясно',
      questionId: 8,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'С этим понятно, давайте дальше',
      questionId: 9,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Окей, что еще мне нужно знать?',
      questionId: 10,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Доступ в интернет',
      questionId: 11,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'IP Адрес',
      questionId: 11,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Часть витой пары проводов',
      questionId: 11,
      sort: 3,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Ничем',
      questionId: 12,
      sort: 1,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Есть запись каналов',
      questionId: 12,
      sort: 2,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'IP TV смотреть можно только на телевизоре',
      questionId: 12,
      sort: 3,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Не требует дополнительного оборудования',
      questionId: 13,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Нет проводов',
      questionId: 13,
      sort: 2,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Есть Full HD качество',
      questionId: 13,
      sort: 3,
      right: false,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Да',
      questionId: 14,
      sort: 1,
      right: true,
      createdAt: '2021-03-03 10:58:13.504000',
      updatedAt: '2021-03-03 10:58:13.504000'
    },{
      text: 'Нет',
      questionId: 14,
      sort: 2,
      right: false,
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
