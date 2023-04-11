const express = require('express');
const router = express.Router();
const multer = require('multer');

const Todo = require('../models/todo');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

router.get('/', (req, res, next) => {
    const pageSize = req.query.pageSize || 5;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;

    Todo.findAndCountAll({
        limit: pageSize,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })
        .then(result => {
            const lists = result.rows;
            const count = result.count;
            const pageCount = Math.ceil(count / pageSize);
            res.render('todos', { lists: lists, pageCount: pageCount, pageSize: pageSize, page: page });
        })
        .catch(error => console.log(error));
});

router.get('/:id', (req, res, next) => {
    Todo.findByPk(req.params.id)
        .then(list => {
            res.render('todos', { list: list });
        })
        .catch(error => console.log(error));
});

router.post('/', upload.single('attachment'), (req, res, next) => {
    const name = req.body.name;
    const status = req.body.status;
    const items = req.body.items;
    // const attachment = req.file ? req.file.path : null;
    const attachment = req.file;

    Todo.create({
        name: name,
        status: status,
        items: items,
        attachment: attachment
    })
        .then(() => {
            res.redirect('/');
        })
        .catch(error => console.log(error));
});

router.get('/edit/:id', upload.single('attachment'), (req, res, next) => {
    Todo.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(todo => {
            res.render('todo-edit', { todo });
        })
        .catch(error => console.log(error));
});

router.post('/edit/:id', (req, res, next) => {
    const name = req.body.name;
    const status = req.body.status;
    const items = req.body.items;
    const attachment = req.file;
    
    // Todo.set({
    //     name: name,
    //     status: status,
    //     items: items,
    //     attachment: attachment
    // }, {
    //     where: {
    //         id: req.params.id,
    //     }
    // })
    
    Todo.findByPk(req.params.id)
    .then(todo => {
        todo.name = name;
        todo.status = status;
        todo.items = items;
        todo.attachment = attachment;
        return todo.save().then(result => {
            console.log('List has been updated!');
            res.redirect('/');
        });
    })
    .catch(error => console.log(error));
});

router.post('/delete/:id', (req, res, next) => {  
    Todo.destroy
        ({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(error => console.log(error));
});

module.exports = router;
