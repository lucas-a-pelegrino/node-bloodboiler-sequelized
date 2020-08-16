const { AccessToken } = require('../models');

module.exports = {
  create: (args) => AccessToken.create(args),
  get: (args) => AccessToken.findOne(args),
  update: (accessToken) => accessToken.save(),
};
