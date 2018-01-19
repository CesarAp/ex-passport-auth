const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const secure = require('../configs/secure.config');

router.get('/profile', secure.isAuthenticated, userController.profile);

module.exports = router;