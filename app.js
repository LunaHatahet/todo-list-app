const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');

const sequelize = require('./util/database');
const User = require('./models/user');
const Todo = require('./models/todo');

const app = express();

app.use(cookieParser());

app.use(morgan('combined'));

app.set('view engine', 'ejs');

const authRoutes = require('./routes/authRoutes');
const todosRoutes = require('./routes/todosRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(todosRoutes);

User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

sequelize
    .sync()
    .then(main => {
        app.listen(3000);
        console.log('Server started on port 3000');
    })
    .catch(err => {
        console.log(err);
    });
