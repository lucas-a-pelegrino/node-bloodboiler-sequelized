const { accessTokenRepository } = require('../../repositories');
const { encryptor } = require('../../helpers');

module.exports = {
  create: async (params) => {
    const token = encryptor.generateToken(params, {
      algorithm: 'HS384',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshParams = { id: params.sub.id };
    const refreshToken = encryptor.generateToken(refreshParams, {
      algorithm: 'HS256',
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
    await accessTokenRepository.create({
      userId: params.sub.id,
      token,
      refreshToken,
    });
    return { token, refreshToken };
  },
};
