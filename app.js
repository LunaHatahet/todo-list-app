const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

const mainRoutes = require('./routes/mainRoutes');

app.use(mainRoutes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
  console.log('Server started on port 3000');
});
