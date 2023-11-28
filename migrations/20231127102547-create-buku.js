'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bukus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      judul: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.DECIMAL
      },
      ketersediaan: {
        type: Sequelize.BOOLEAN
      },
      sinopsis: {
        type: Sequelize.TEXT
      },
      genre: {
        type: Sequelize.STRING
      },
      gambar_buku: {
        type: Sequelize.STRING
      },
      penulis: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bukus');
  }
};