'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Buku.init({
    judul: DataTypes.STRING,
    harga: DataTypes.DECIMAL,
    ketersediaan: DataTypes.BOOLEAN,
    sinopsis: DataTypes.TEXT,
    genre: DataTypes.STRING,
    gambar_buku: DataTypes.STRING,
    penulis: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Buku',
  });
  return Buku;
};