const { AccessToken } = require('../models');

module.exports = {
  create: (args) => AccessToken.create(args),
  get: (args) => AccessToken.findOne(args),
  update: (obj, id) => AccessToken.update(obj, { where: { id } }),
};
