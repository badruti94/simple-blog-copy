'use strict';
const users = require('./data-post.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const usersWithDate = users.map((user, i) => ({
      ...user,
      createdAt: new Date(new Date().getTime() + parseInt(`${i}000`)),
      updatedAt: new Date()
    }))
    // await queryInterface.bulkInsert('posts', usersWithDate, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('posts', null, {});
  }
};
