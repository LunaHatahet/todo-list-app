const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');

const options = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
};

const transporter = nodemailer.createTransport(sgTransport(options));

const sendResetPasswordEmail = async (email) => {
    const token = crypto.randomBytes(20).toString('hex');
    const resetPasswordUrl = `http://localhost:3000/reset-password/${token}`;
    const message = {
        to: email,
        from: 'luna.hatahet@gmail.com',
        subject: 'Reset your password',
        html: `Please click this link to reset your password: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
    };
    try {
        await transporter.sendMail(message);
        const user = await User.findOne({ where: { email: email } });
        user.token = token;
        await user.save();
        return token;
    } catch (error) {
        console.log(error);
        throw new Error('Could not send -Reset Password- email.');
    }
};

const sendNewListCreationEmail = async (email) => {
    const message = {
        to: email,
        from: 'luna.hatahet@gmail.com',
        subject: 'New List Created',
        text: 'You have successfully created a new list!'
    };
    try {
        await transporter.sendMail(message);
    } catch (error) {
        throw new Error('Could not send -New List- email.');
    }
};

module.exports = { sendResetPasswordEmail, sendNewListCreationEmail};
