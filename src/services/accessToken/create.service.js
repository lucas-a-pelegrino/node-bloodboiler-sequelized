const { accessTokenRepository } = require('../../repositories');
const { encryptor } = require('../../helpers');

const { refreshTokenExpiresIn, accessTokenExpiresIn } = require('../../config/env');

module.exports = {
  create: async (params) => {
    const token = encryptor.generateToken(params, {
      algorithm: 'HS384',
      expiresIn: accessTokenExpiresIn,
    });

    const refreshParams = { id: params.sub.id };
    const refreshToken = encryptor.generateToken(refreshParams, {
      algorithm: 'HS256',
      expiresIn: refreshTokenExpiresIn,
    });

    await accessTokenRepository.create({
      userId: params.sub.id,
      token,
      refreshToken,
    });

    return { token, refreshToken };
  },
};
