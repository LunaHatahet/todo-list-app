const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

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

router.get('/', todoController.pagination);
router.post('/', upload.single('attachment'), todoController.createList);
router.get('/edit/:id', upload.single('attachment'), todoController.editList);
router.post('/edit/:id', todoController.updateList);
// router.get('/:id', todoController.listDetails);
router.post('/delete/:id', todoController.deleteList);

module.exports = router;
