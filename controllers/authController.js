const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const saltRounds = 10;
const JWT_SECRET = 'd1b41c94f57ce66f9020b70f6bad485d3dcd4a73ffa7cd9643754535c7896ef7db2e2040772773d2efd00fde1eb4089b2a38a75e626d7d16042821c4b2a4a2bb';

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
    console.log(id);

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
    const { email, password } = req.body;
    
    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                bcrypt.hash(password, 12, (err, hashedPassword) => {
                    user.update({
                        password: hashedPassword
                    })
                        .then(() => {
                            console.log('Your password has been reset!');
                            res.redirect('/login');
                        })
                        .catch(err => {
                            console.log('Error updating password.');
                            res.redirect('/reset-password');
                        });
                });
            } else {
                res.redirect('/reset-password');
            }
        })
        .catch(() => {
            console.log('No account with that email address exists.');
            return res.redirect('/reset-password');
        });
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