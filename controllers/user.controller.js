

module.exports.profile = (req, res, next) => {
    res.render('user/profile', {
        session: req.session.currentUser
    });
}