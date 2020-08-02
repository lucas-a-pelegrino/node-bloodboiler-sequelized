const { accessTokenRepository } = require('../../repositories');
const { encryptor } = require('../../helpers');

module.exports = {
  create: async (params) => {
    const token = encryptor.generateToken(params, {
      algorithm: 'HS384',
      expiresIn: 86000,
    });
    const refreshParams = { id: params.sub.id };
    const refreshToken = encryptor.generateToken(refreshParams, {
      algorithm: 'HS256',
      expiresIn: 86000 * 30,
    });
    await accessTokenRepository.create({
      userId: params.sub.id,
      token,
      refreshToken,
    });
    return { token, refreshToken };
  },
};
