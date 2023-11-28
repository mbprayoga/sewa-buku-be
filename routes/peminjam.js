const express = require('express');
const peminjamController = require('../controllers/peminjam.controller');
const imageUploader = require('../helpers/image-uploader');
const sessionMiddleware = require('../middleware/sessionMiddleware');

const router = express.Router();

router.use(sessionMiddleware);

router.get("/buku", peminjamController.showBookAll);
router.post("/buku/:id/pinjam", peminjamController.pinjamBuku);

router.get("/peminjaman/:id_p", peminjamController.showPeminjamanAll);
router.patch("/peminjaman/:id/bayar", imageUploader.upload.single('image'), (req, res) =>{
    if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const uploadedFileUrl = req.file.path;
      peminjamController.bayarPeminjaman(req,res, uploadedFileUrl);
});
router.patch("/peminjaman/:id/bayar-denda", imageUploader.upload.single('image'), (req, res) =>{
    if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const uploadedFileUrl = req.file.path;
      peminjamController.bayarDenda(req,res, uploadedFileUrl);
});

router.patch("/edit/:id", peminjamController.editPeminjam);
router.patch("/edit-password/:id", peminjamController.editPeminjamPassword);

module.exports = router;