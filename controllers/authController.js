const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

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
                    if (!req.session) {
                        req.session = {};
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


exports.resetPassword = (req, res, next) => {
    res.render('reset-password');
};

exports.resetPasswordSubmit = (req, res, next) => {
    // const email = req.body.email;
    // User.findOne({ where: { email: email } })
    //     .then(user => {
    //         if (!user) {
    //             req.flash('error', 'No account with that email address exists.');
    //             return res.redirect('/reset-password');
    //         }
    //         const token = crypto.randomBytes(20).toString('hex');
    //         user.resetPasswordToken = token;
    //         user.resetPasswordExpires = Date.now() + 3600000;
    //         user
    //             .save()
    //             .then(() => {
    //                 const transporter = nodemailer.createTransport({
    //                     service: 'gmail',
    //                 });
    //                 const mailOptions = {
    //                     to: email,
    //                     from: 'admin@todo-list.com',
    //                     subject: 'Reset your password',
    //                     text: `You are receiving this because you (or someone else) have requested to reset your password.\n\nPlease click on the following link to complete the process:\n\nhttp://${req.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    //                 };
    //                 transporter.sendMail(mailOptions)
    //                     .then(() => {
    //                         req.flash('success', `An email has been sent to ${email}.`);
    //                         res.redirect('/login');
    //                     })
    //                     .catch(err => console.log(err));
    //             })
    //             .catch(err => console.log(err));
    //     })
    //     .catch(err => console.log(err));
};