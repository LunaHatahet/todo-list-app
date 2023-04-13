const Todo = require('../models/todo');

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
    const { name, status, items, attachment } = req.body;
    const userId = req.user.id;
    // const attachment = req.file;
    
    Todo.create({
        name: name,
        status: status,
        items: items,
        attachment: attachment,
        userId: userId
    })
        .then(() => {
            res.redirect('/');
        })
        .catch(error => console.log(error));
};

exports.editList = (req, res, next) => {
    Todo.findOne({ where: { id: req.user.id } })
        .then(todo => {
            res.render('todo-edit', { todo });
        })
        .catch(error => console.log(error));
};

exports.updateList = (req, res, next) => {
    const { name, status, items, attachment } = req.body;
    // const attachment = req.file;
    
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
    
    Todo.findByPk(req.user.id)
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
    
// exports.listDetails = (req, res, next) => {
//     Todo.findByPk(req.params.id)
//         .then(list => {
//             res.render('todos', { list: list });
//         })
//         .catch(error => console.log(error));
// };

exports.deleteList = (req, res, next) => {  
    Todo.destroy({ where: { id: req.user.id } })
    .then(() => {
        res.redirect('/');
    })
    .catch(error => console.log(error));
};
