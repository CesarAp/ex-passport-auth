const User = require('../models/user.model');

module.exports.profile = (req, res, next) => {
    res.render('user/profile', {
        session: req.user
    });
}

module.exports.list = (req, res, next) => {
    User.find({})
        .then(users => {
            res.render('user/list', {
                users: users,
                session: req.user
            });
        })
        .catch(error => next(error));
}