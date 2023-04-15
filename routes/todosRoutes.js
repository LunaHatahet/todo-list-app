const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const isAuth = require('../middleware/isauth');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/', isAuth, todoController.pagination);
router.post('/', isAuth, upload.single('attachment'), todoController.createList);
router.get('/edit/:id', isAuth, todoController.editList);
router.post('/edit/:id', isAuth, upload.single('attachment'), todoController.updateList);
router.post('/delete/:id', isAuth, todoController.deleteList);

module.exports = router;
