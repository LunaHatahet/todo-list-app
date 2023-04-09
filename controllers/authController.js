const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                return res.status(401).send('Invalid email or password');
            }
            bcrypt
                .compare(password, user.password)
                .then(match => {
                    if (!match) {
                        return res.status(401).send('Invalid email or password');
                    }
                    req.session.user = user;
                    res.redirect('/');
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};
