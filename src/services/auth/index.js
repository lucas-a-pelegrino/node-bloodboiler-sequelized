const { signin } = require('./signin.service');
const { forgotPassword } = require('./forgotPassword.service');
const { resetPassword } = require('./resetPassword.service');
const { refreshToken } = require('./refreshToken.service');

module.exports = {
  signin,
  forgotPassword,
  resetPassword,
  refreshToken,
};
