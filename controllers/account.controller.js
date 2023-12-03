const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const models = require('../models');
const Validator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const moment = require('moment');
const session = require('express-session');


async function getUserData(req, res) {
    try {
      // Check if there is a user session
      if (req.session.user) {
        const { username, role } = req.session.user;
  
        // You may want to retrieve additional user data based on the role
        let userData;
  
        if (role === 'peminjam') {
          userData = await models.Peminjam.findOne({ where: { username } });
        } else if (role === 'admin') {
          userData = await models.Admin.findOne({ where: { username } });
        }
  
        if (userData) {
          res.json({ username, role, additionalData: userData });
        } else {
          res.status(404).json({ message: 'User data not found' });
        }
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      // Check if the user is a Peminjam
      const peminjamResult = await models.Peminjam.findOne({ where: { username } });
  
      if (peminjamResult) {
        const match = await bcryptjs.compare(password, peminjamResult.password);
  
        if (match) {
          req.session.user = {
            username: peminjamResult.username,
            role: 'peminjam',
          };
          res.json({ message: 'Login successful', role: 'user' });
        } else {
          res.status(401).json({ message: 'Bad Credentials' });
        }
      } else {
        // Check if the user is an Admin
        const adminResult = await models.Admin.findOne({ where: { username } });
  
        if (adminResult) {
          const match = await bcryptjs.compare(password, adminResult.password);
  
          if (match) {
            req.session.user = {
              username: adminResult.username,
              role: 'admin',
            };
            res.json({ message: 'Login successful', role: 'admin' });
          } else {
            res.status(401).json({ message: 'Bad Credentials' });
          }
        } else {
          // If neither Peminjam nor Admin, return Bad Credentials
          res.status(401).json({ message: 'Bad Credentials' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

function logout(req, res){
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logout successful' });
      });
}

function addPeminjam(req, res,){
    models.Peminjam.findOne({where:{username: req.body.username}}).then(result =>{
        if (result){
            res.status(409).json({
                message: 'Username exist'
            })        
        }else{
            models.Admin.findOne({where:{username: req.body.username}}).then(result =>{
                if (result){
                    res.status(409).json({
                        message: 'Username exist'
                    })
                }else{
                    bcryptjs.genSalt(10,async function(err,salt){
                        bcryptjs.hash(req.body.password,salt,async function(err,hash){
                            const peminjam = {
                                nama: req.body.nama,
                                username: req.body.username,
                                password: hash,
                                no_hp: req.body.no_hp,
                                alamat: req.body.alamat
                            }
                        
                            const schema = {
                                nama: {type:"string", optional:false, max:50},
                                username: {type:"string", optional:false, max:50},
                                password: {type:"string", optional:false},
                                no_hp: {type:"string", optional:false},
                                alamat: {type:"string", optional:false},
                            }
                        
                            const v = new Validator();
                            const validationResponse = v.validate(peminjam, schema);
                        
                            if(validationResponse !== true){
                                return res.status(400).json({
                                    message: "Validation false",
                                    errors: validationResponse
                                });
                            }
                        
                            models.Peminjam.create(peminjam).then(result => {
                                res.status(201).json({
                                    message: "Peminjam created successfully"
                                });
                            }).catch(error =>{
                                res.status(500).json({
                                    message: "Something went wrong",
                                    error:error
                                });
                            });        
                    
                        })
                    })
                }
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    })   
}

function addAdmin(req, res,){
    models.Peminjam.findOne({where:{username: req.body.username}}).then(result =>{
        if (result){
            res.status(409).json({
                message: 'Username exist'
            })        
        }else{
            models.Admin.findOne({where:{username: req.body.username}}).then(result =>{
                if (result){
                    res.status(409).json({
                        message: 'Username exist'
                    })
                }else{
                    bcryptjs.genSalt(10,async function(err,salt){
                        bcryptjs.hash(req.body.password,salt,async function(err,hash){
                            const admin = {
                                username: req.body.username,
                                password: hash
                            }
                        
                            const schema = {
                                username: {type:"string", optional:false, max:50},
                                password: {type:"string", optional:false},
                            }
                        
                            const v = new Validator();
                            const validationResponse = v.validate(admin, schema);
                        
                            if(validationResponse !== true){
                                return res.status(400).json({
                                    message: "Validation false",
                                    errors: validationResponse
                                });
                            }
                        
                            models.Admin.create(admin).then(result => {
                                res.status(201).json({
                                    message: "Admin created successfully"
                                });
                            }).catch(error =>{
                                res.status(500).json({
                                    message: "Something went wrong",
                                    error:error
                                });
                            });        
                    
                        })
                    })
                }
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    })   
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

module.exports = {
    addPeminjam:addPeminjam,
    addAdmin:addAdmin,
    login:login,
    logout:logout,
    getUserData:getUserData,
    showBookAll:showBookAll
}