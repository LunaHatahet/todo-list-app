const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');

const mainRoutes = require('./routes/mainRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainRoutes);
app.use(authRoutes);

sequelize
    .sync()
    .then(main => {
        app.listen(3000);
        console.log('Server started on port 3000');
    })
    .catch(err => {
        console.log(err);
    });
