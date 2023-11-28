const express = require('express');
const adminController = require('../controllers/admin.controller');
const imageUploader = require('../helpers/image-uploader');
const sessionMiddleware = require('../middleware/sessionMiddleware');

const router = express.Router();


router.use(sessionMiddleware);

router.get("/peminjam", adminController.showPeminjamAll);

router.get("/buku", adminController.showBookAll);
router.post("/buku/add", adminController.addBook);
router.patch("/buku/:id/image-up", imageUploader.upload.single('image'), (req, res) =>{
    if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const uploadedFileUrl = req.file.path;
      adminController.editBookImage(req,res, uploadedFileUrl);
});
router.patch("/buku/:id/edit", adminController.editBook);
router.delete("/buku/:id/edit", adminController.deleteBook);
router.get("/peminjaman", adminController.showPeminjamanAll);
router.patch("/peminjaman/:id/kembali", adminController.kembaliPeminjaman);

module.exports = router;