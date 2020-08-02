const moment = require('moment');

const { resetTokenExpiresTime, resetTokenExpiresTimeFormat } = require('../../config/env');

const { usersService, accessTokenService } = require('../../services');
const { jwt } = require('../../utils');

const getSampleUser = async (id) => usersService.get(id);

const generateExpiredToken = async (id) => {
  const payload = {
    sub: id,
    exp: moment()
      .subtract(resetTokenExpiresTime, resetTokenExpiresTimeFormat)
      .unix(),
  };

  const token = await jwt.issue(payload);
  await usersService.update(id, { passwordResetToken: token });

  return token;
};

const generateSampleToken = async (id) => {
  const payload = {
    sub: { id },
    iat: moment().unix(),
  };

  return accessTokenService.create(payload);
};
const generateSampleInvalidToken = async (id) => {
  const payload = {
    sub: { id },
    iat: moment().unix(),
  };

  return jwt.issue(payload);
};
const malformedToken = 'khjkasgjhja';

module.exports = {
  getSampleUser,
  generateExpiredToken,
  generateSampleToken,
  generateSampleInvalidToken,
  malformedToken,
};
