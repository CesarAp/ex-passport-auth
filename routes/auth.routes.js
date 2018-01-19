const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

router.get('/signup', authController.signup);
router.post('/signup', authController.doSignup);

router.get('/login', authController.login);
router.post('/login', authController.doLogin);

router.post('/auth/fb', passport.authenticate('fb-auth'));
router.get('/auth/fb/cb', authController.loginWithFacebookCallback)

router.get('/logout', authController.logout);

module.exports = router;
