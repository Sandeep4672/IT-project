function ensureAuthenticated(req, res, next) {
    if (!res.locals.isAuth ) {
        console.log("Hi ensureAuthenticated");
        return res.redirect('/401');
    }
    next();
}

module.exports=ensureAuthenticated;