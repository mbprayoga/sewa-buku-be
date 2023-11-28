'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Peminjamans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_peminjam: {
        type: Sequelize.INTEGER
      },
      status_bayar: {
        type: Sequelize.BOOLEAN
      },
      bukti_bayar: {
        type: Sequelize.STRING
      },
      bukti_denda: {
        type: Sequelize.STRING
      },
      tanggal_pinjam: {
        type: Sequelize.DATE
      },
      tanggal_kembali: {
        type: Sequelize.DATE
      },
      denda: {
        type: Sequelize.DECIMAL
      },
      status_kembali: {
        type: Sequelize.BOOLEAN
      },
      id_buku: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Peminjamans');
  }
};