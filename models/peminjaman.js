'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Peminjaman.belongsTo(models.Peminjam, {
        foreignKey: 'id_peminjam', 
        as: 'peminjam',
      });
      Peminjaman.belongsTo(models.Buku, {
        foreignKey: 'id_buku', 
        as: 'buku', 
      });
    }
  }
  Peminjaman.init({
    id_peminjam: DataTypes.INTEGER,
    status_bayar: DataTypes.BOOLEAN,
    bukti_bayar: DataTypes.STRING,
    tanggal_pinjam: DataTypes.DATE,
    tanggal_kembali: DataTypes.DATE,
    denda: DataTypes.DECIMAL,
    bukti_denda: DataTypes.STRING,
    status_kembali: DataTypes.BOOLEAN,
    id_buku: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Peminjaman',
  });
  return Peminjaman;
};