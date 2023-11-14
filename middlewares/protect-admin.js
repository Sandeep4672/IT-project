function ensureAdmin(req, res, next) {
  console.log("Admin-middleware");
  if (!res.locals.isAdmin) {
      return res.redirect('/403');
  }
  next();
}

module.exports=ensureAdmin;