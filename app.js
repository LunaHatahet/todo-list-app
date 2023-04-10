const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const sequelize = require('./util/database');

const app = express();

app.use(morgan('combined'));

app.set('view engine', 'ejs');

const authRoutes = require('./routes/authRoutes');
const todosRoutes = require('./routes/todosRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(todosRoutes);

sequelize
    .sync()
    .then(main => {
        app.listen(3000);
        console.log('Server started on port 3000');
    })
    .catch(err => {
        console.log(err);
    });
