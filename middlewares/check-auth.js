function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    const name=req.session.name;
    if (!uid) {
      return next();
    }
  
    res.locals.uid = uid;
    res.locals.isAuth = true; 
    res.locals.name=name;
    console.log(res.locals.name);
    res.locals.isAdmin = req.session.isAdmin; 
    next();
  }
  
  module.exports = checkAuthStatus;