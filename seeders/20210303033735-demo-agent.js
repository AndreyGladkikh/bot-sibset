'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('agents', [{
       phone: '+79998887766',
       nickname: 'John Doe',
       day: 1,
       isActive: true,
       lastQuestion: null,
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
    await queryInterface.bulkDelete('agents', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
