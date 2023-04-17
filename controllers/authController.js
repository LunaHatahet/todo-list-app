const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Email = require('../util/email');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res, next) => {
    res.render('login');
};

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;

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
                    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
                    res.cookie('jwt', token, { httpOnly: true });
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
    const { name, email, password } = req.body;
    const id = uuidv4();

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            User.create({
                id: id,
                name: name,
                email: email,
                password: hashedPassword
            })
                .then(() => res.redirect('/login'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};


exports.resetPassword = (req, res, next) => {
    res.render('reset-password');
};

exports.resetPasswordSubmit = (req, res, next) => {
    const { email } = req.body;
    
    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                Email.sendResetPasswordEmail(email);
            } else {
                res.redirect('/reset-password');
            }
        })
        .catch(() => {
            console.log('No account with that email address exists.');
            return res.redirect('/reset-password');
        });
};

exports.updatePassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ where: { token: token } })
    .then(user => {
        res.render('update-password', { user: user.toJSON() });
    })
    .catch(error => console.log(error));
};

exports.updatePasswordSubmit = (req, res, next) => {
    const password = req.body.password;
    const token = req.params.token;

    User.findOne({ where: { token: token } })
        .then(user => {
            bcrypt.hash(password, 12, (err, hashedPassword) => {
                user.update({
                    password: hashedPassword,
                    token: null
                })
                    .then(() => {
                        console.log('Your password has been reset!');
                        res.redirect('/login');
                    })
                    .catch(() => {
                        console.log('Error updating password.');
                        res.redirect('/reset-password');
                    });
            });
        })
        .catch(error => console.log(error));     
};