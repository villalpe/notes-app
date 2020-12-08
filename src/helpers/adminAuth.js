const helpers = {};

helpers.isAdminAuthenticated = (req, res, next) => {
  if (req.isAdminAuthenticated() && req.user.name === "admin") {
    return next();
  }
  req.flash('error_msg', 'Not Authorized to Add Theaters.');
  res.redirect('/users/signin');
};

module.exports = helpers;