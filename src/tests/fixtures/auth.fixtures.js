const moment = require('moment');

const { resetTokenExpiresIn } = require('../../config/env');

const { usersService, accessTokenService } = require('../../services');
const { jwt } = require('../../utils');

const getSampleUser = async (id) => usersService.get(id);

const generateExpiredToken = async (id) => {
  const payload = {
    sub: id,
    iat: moment().unix(),
  };

  const token = await jwt.issue(payload, {
    algorithm: 'HS256',
    expiresIn: `-${resetTokenExpiresIn}`,
  });

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
const malformedToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjEsIm5hbWUiOiJFbGlhcyBSYWJlbG8iLCJlbWFpbC5jb20uYnJyIn0sImlhdCI6MTU5NjM5NjU3OX0.BptQRTp58XgH_qHDIx2n-7SZGIE-e3FU6cG7bBZBR0E';

module.exports = {
  getSampleUser,
  generateExpiredToken,
  generateSampleToken,
  generateSampleInvalidToken,
  malformedToken,
};
