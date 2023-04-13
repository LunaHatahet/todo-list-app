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
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

router.get('/', isAuth, todoController.pagination);
router.post('/', isAuth, upload.single('attachment'), todoController.createList);
router.get('/edit/:id', isAuth, upload.single('attachment'), todoController.editList);
router.post('/edit/:id', isAuth, todoController.updateList);
// router.get('/:id', isAuth, todoController.listDetails);
router.post('/delete/:id', isAuth, todoController.deleteList);

module.exports = router;
