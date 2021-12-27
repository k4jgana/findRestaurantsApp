module.exports = {
    checkAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/login');
    },
    checkNotAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return res.redirect('/dashboard');    
        }
        return next();
    }
}