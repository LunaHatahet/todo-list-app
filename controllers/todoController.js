const Todo = require('../models/todo');
const User = require('../models/user');
const Email = require('../util/email');
const { v4: uuidv4 } = require('uuid');

exports.pagination = (req, res, next) => {
    const pageSize = req.query.pageSize || 5;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;

    Todo.findAndCountAll({
        where: { userId: req.user.id },
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
};

exports.createList = (req, res, next) => {
    const { name, status, items } = req.body;
    const attachment = req.file ? req.file.filename : null;
    const userId = req.user.id;
    const id = uuidv4();

    User.findOne({ where: { id: userId } })
        .then (user => {
            const userEmail = user.email;
            Todo.create({
                id: id,
                name: name,
                status: status,
                items: items,
                attachment: attachment,
                userId: userId
            })
                .then(() => {
                    Email.sendNewListCreationEmail(userEmail);
                    res.redirect('/');
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
};

exports.editList = (req, res, next) => {
    Todo.findOne({ where: { id: req.params.id } })
        .then(todo => {
            res.render('todo-edit', { todo: todo.toJSON() });
        })
        .catch(error => console.log(error));
};

exports.updateList = (req, res, next) => {
    const name = req.body.name;
    const status = req.body.status;
    const items = req.body.items;
    const attachment = req.file ? req.file.filename : null;;

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
};

exports.deleteList = (req, res, next) => {  
    Todo.destroy({ where: { id: req.params.id } })
    .then(() => {
        res.redirect('/');
    })
    .catch(error => console.log(error));
};
