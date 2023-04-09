const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.login = (req, res, next) => {
    res.render('login');
};

exports.loginUser = (req, res, next) => {
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

exports.signup = (req, res, next) => {
    res.render('signup');
};

exports.signupUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            User.create({
                name: name,
                email: email,
                password: hashedPassword
            })
                .then(() => res.redirect('/login'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};
