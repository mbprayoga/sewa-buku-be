const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const models = require('../models');
const Validator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const moment = require('moment');


function editPeminjam(req, res){
    const id = req.params.id;
    const peminjam = {
        nama: req.body.nama,
        no_hp: req.body.no_hp,
        alamat: req.body.alamat
    }    
    const schema = {
        nama: {type:"string", optional:true, max:50},
        no_hp: {type:"string", optional:true},
        alamat: {type:"string", optional:true},
    }
                        
    const v = new Validator();
    const validationResponse = v.validate(peminjam, schema);
                
    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation false",
            errors: validationResponse
        });
    }
                        
    models.Peminjam.update(peminjam, {where:{id:id}}).then(result => {
        res.status(201).json({
            message: "Peminjam updated successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong1",
            error:error
        });
    });                   
}

async function editPeminjamPassword(req, res) {
    const id = req.params.id;

    try {
        // Check if the username already exists in Admin
        const adminResult = await models.Admin.findOne({ where: { username: req.body.username } });
        if (adminResult) {
            return res.status(409).json({
                message: 'Username exists in Admin'
            });
        }

        // Check if the username already exists in Peminjam
        const peminjamResult = await models.Peminjam.findOne({ where: { username: req.body.username } });
        if (peminjamResult) {
            return res.status(409).json({
                message: 'Username exists in Peminjam'
            });
        }

        // Generate salt and hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Prepare the updated Peminjam object
        const updatedPeminjam = {
            username: req.body.username,
            password: hash
        };

        // Validate the Peminjam object
        const schema = {
            username: { type: 'string', optional: false },
            password: { type: 'string', optional: false }
        };

        const v = new Validator();
        const validationResponse = v.validate(updatedPeminjam, schema);

        if (validationResponse !== true) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResponse
            });
        }

        // Update the Peminjam in the database
        const updateResult = await models.Peminjam.update(updatedPeminjam, { where: { id: id } });

        if (updateResult) {
            return res.status(201).json({
                message: 'Peminjam updated successfully'
            });
        } else {
            return res.status(500).json({
                message: 'Failed to update Peminjam'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: error
        });
    }
}

function showBookAll(req,res){
    models.Buku.findAll().then(result =>{
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

function pinjamBuku(req, res){
    try{
        const id_buku = req.params.id;
        const peminjaman = {
            id_buku: id_buku,
            id_peminjam: req.body.id_peminjam,
            status_bayar: false,
            tanggal_pinjam: req.body.tanggal_pinjam,
            tanggal_kembali: req.body.tanggal_kembali,
            denda: 0,
            status_kembali: false,
        }
            
        models.Peminjaman.create(peminjaman).then(result => {
            const updateBuku = {ketersediaan:false}
            models.Buku.update(updateBuku,{where:{id:id_buku}})
            res.status(201).json({
                message: "Peminjaman berhasil"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong1",
                error:error
            });
        });
    }catch{
        res.status(500).json({
            message: "Something went wrong1",
            error:error
        });
    }
}

function bayarPeminjaman(req, res, url){
    try{
        const baseUrl = 'http://localhost:3000/'
        const fileName = url.replace('\\' , '/');

        const id_peminjaman = req.params.id;
        const peminjaman = {
            status_bayar: true,
            bukti_bayar: baseUrl+fileName,
        }
            
        models.Peminjaman.update(peminjaman, {where:{id:id_peminjaman}}).then(result => {
            res.status(201).json({
                message: "Pembayaran berhasil"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong1",
                error:error
            });
        });
    }catch{
        res.status(500).json({
            message: "Something went wrong1",
            error:error
        });
    }
}

function bayarDenda(req, res, url){
    try{
        const baseUrl = 'http://localhost:3000/'
        const fileName = url.replace('\\' , '/');

        const id_peminjaman = req.params.id;
        const peminjaman = {
            denda: 0,
            bukti_denda: baseUrl+fileName,
        }
            
        models.Peminjaman.update(peminjaman, {where:{id:id_peminjaman}}).then(result => {
            res.status(201).json({
                message: "Pembayaran berhasil"
            });
        }).catch(error =>{
            res.status(500).json({
                message: "Something went wrong1",
                error:error
            });
        });
    }catch{
        res.status(500).json({
            message: "Something went wrong1",
            error:error
        });
    }
}

function showPeminjamanAll(req, res){
    const statusBayarFilter = req.query.status_bayar;
    const statusKembaliFilter = req.query.status_kembali;
    const dendaFilter = req.query.denda;

    const whereClause = {id_peminjam:req.params.id_p};
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



module.exports = {
    editPeminjam:editPeminjam,
    editPeminjamPassword:editPeminjamPassword,
    showBookAll:showBookAll,
    pinjamBuku:pinjamBuku,
    bayarPeminjaman:bayarPeminjaman,
    showPeminjamanAll:showPeminjamanAll,
    bayarDenda:bayarDenda
}