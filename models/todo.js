const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Todo = sequelize.define('todo', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    items: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    attachment: {
        type: Sequelize.STRING
    }
});

module.exports = Todo;
