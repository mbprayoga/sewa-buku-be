const express = require('express');
const accountController = require('../controllers/account.controller');
const imageUploader = require('../helpers/image-uploader')

const router = express.Router();

router.post("/register/peminjam", accountController.addPeminjam);
router.post("/register/admin", accountController.addAdmin);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);
router.get("/user-data", accountController.getUserData);
router.get("/book", accountController.showBookAll);

module.exports = router;