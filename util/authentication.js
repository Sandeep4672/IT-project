function createUserSession(req, user, action) {
    req.session.uid = user._id.toString();
    req.session.name=user.name;
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
  }
  
  function destroyUserAuthSession(req) {
    req.session.destroy();
  }
  
  module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
};