const jwt = require('jsonwebtoken');

const { secret } = require('../config/env');

module.exports.jwt = {
  issue: (payload, options) => jwt.sign(payload, secret, options),
  verify: (token, callback) => jwt.verify(token, secret, callback),
};
