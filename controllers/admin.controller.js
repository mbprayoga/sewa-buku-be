const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const models = require('../models');
const Validator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const moment = require('moment');

function showPeminjamAll(req, res){
    models.Peminjam.findAll().then(result =>{
        res.status(200).json({
            peminjam:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showBookAll(req,res){
    const ketersediaanFilter = req.query.ketersediaan;
    const whereClause = ketersediaanFilter ? { ketersediaan: ketersediaanFilter } : {};
    models.Buku.findAll({
        where: whereClause
    }).then(result =>{
        res.status(200).json({
            buku:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function addBook(req,res){
    try {
        const buku = {
            judul: req.body.judul,
            harga: req.body.harga,
            ketersediaan: true,
            sinopsis: req.body.sinopsis,
            genre: req.body.genre,
            penulis: req.body.penulis,
        }
        // const schema = {
        //     judul: {type:"string", optional:false, max:50},
        //     ketersediaan:{optional:false},
        //     harga: {optional:false},
        //     sinopsis: {optional:false},
        //     genre: {type:"string", optional:false},
        //     penulis: {type:"string", optional:false}   
        // }

        // const v = new Validator();
        // const validationResponse = v.validate(buku, schema);

        // if(validationResponse !== true){
        //     return res.status(400).json({
        //         message: "Validation false",
        //         errors: validationResponse
        //     });
        // }
        models.Buku.create(buku).then(result => {
            res.status(201).json({
                message: "Buku created successfully"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong",
                error:error
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong1",
            error: error
        });
    }
}


function editBook(req,res, url){
    try {   
        const id = req.params.id;
        const buku = {
            judul: req.body.judul,
            harga: req.body.harga,
            ketersediaan: req.body.ketersediaan,
            sinopsis: req.body.sinopsis,
            genre: req.body.genre,
            penulis: req.body.penulis,
        }
        // const schema = {
        //     judul: {type:"string", optional:true, max:50},
        //     harga: {optional:true},
        //     ketersediaan: {optional:true},
        //     sinopsis: {optional:true},
        //     genre: {type:"string", optional:true},
        //     penulis: {type:"string", optional:true}   
        // }

        // const v = new Validator();
        // const validationResponse = v.validate(buku, schema);

        // if(validationResponse !== true){
        //     return res.status(400).json({
        //         message: "Validation false",
        //         errors: validationResponse
        //     });
        // }
        models.Buku.update(buku, {where:{id:id}}).then(result => {
            res.status(201).json({
                message: "Buku updated successfully"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong",
                error:error
            });
        }); 
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

function editBookImage(req,res, url){
    try {
        const baseUrl = 'http://localhost:3000/';
        const fileName = url.replace('\\' , '/');    
        const id = req.params.id;
        const buku = {
            gambar_buku: baseUrl + fileName
        }
        models.Buku.update(buku, {where:{id:id}}).then(result => { 
            res.status(201).json({
                message: "Buku updated successfully"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong1",
                error:error
            });
        }); 
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong2",
            error: error
        });
    }
}

function deleteBook(req,res){
    const id = req.params.id;
    models.Buku.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message: "Buku deleted"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });     
}

function showPeminjamanAll(req, res){
    const statusBayarFilter = req.query.status_bayar;
    const statusKembaliFilter = req.query.status_kembali;
    const dendaFilter = req.query.denda;

    const whereClause = {};
    if (statusBayarFilter !== undefined) {
        whereClause.status_bayar = statusBayarFilter;
    }
    if (statusKembaliFilter !== undefined) {
        whereClause.status_kembali = statusKembaliFilter;
    }
    if (dendaFilter !== undefined) {
        if (dendaFilter === 'true') {
            whereClause.denda = {
                [Op.gt]: 0
            };
        } 
    }

    models.Peminjaman.findAll({
        include: 
        [{
            model: models.Peminjam,
            as: 'peminjam',
        },
        {
            model: models.Buku,
            as: 'buku',
        }],
        where: whereClause
    }).then(result =>{
        res.status(200).json({
            peminjaman:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function kembaliPeminjaman(req, res) {
    try {
        const id_peminjaman = req.params.id;

        // Find the Peminjaman record
        models.Peminjaman.findOne({ where: { id: id_peminjaman } }).then(peminjamanRecord => {
            const id_buku = peminjamanRecord.id_buku;
            if (!peminjamanRecord) {
                return res.status(404).json({
                    message: "Peminjaman record not found"
                });
            }

            // Check if the status_kembali is already true
            if (peminjamanRecord.status_kembali) {
                return res.status(400).json({
                    message: "Peminjaman has already been returned"
                });
            }

            // Calculate the difference in days between current date and tanggal_kembali using moment
            const currentDate = moment();
            const tanggalKembali = moment(peminjamanRecord.tanggal_kembali);
            const differenceInDays = currentDate.diff(tanggalKembali, 'days');

            // Calculate denda (increase by 10000 per day)
            const denda = differenceInDays > 0 ? differenceInDays * 10000 : 0;

            // Update status_kembali and denda in the database
            const updateValues = {
                status_kembali: true,
                denda: denda
            };

            models.Peminjaman.update(updateValues, { where: { id: id_peminjaman } }).then(result => {
                const updateBuku = {ketersediaan:true};
                models.Buku.update(updateBuku,{where:{id:id_buku}});
                res.status(201).json({
                    message: "Pengembalian berhasil",
                    denda: denda
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong1",
                    error: error
                });
            });
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

module.exports = {
    showPeminjamAll:showPeminjamAll,
    showBookAll:showBookAll,
    addBook:addBook,
    editBook:editBook,
    deleteBook:deleteBook,
    showPeminjamanAll:showPeminjamanAll,
    kembaliPeminjaman:kembaliPeminjaman,
    editBookImage:editBookImage
}