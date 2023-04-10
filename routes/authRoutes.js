const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.post('/login', authController.loginUser);
router.get('/signup', authController.signup);
router.post('/signup', authController.signupUser);
router.get('/reset-password', authController.resetPassword);
router.post('/reset-password', authController.resetPasswordSubmit);

module.exports = router;
