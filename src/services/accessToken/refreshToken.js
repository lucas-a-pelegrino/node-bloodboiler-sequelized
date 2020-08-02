const httpCodes = require('http-status-codes');
const moment = require('moment');
const { Op } = require('sequelize');
const { jwt, ApplicationError } = require('../../utils');
const { create } = require('./create');
const { accessTokenRepository, usersRepository } = require('../../repositories');

module.exports = {
  refreshToken: async (token, refreshToken) => {
    let userId;
    jwt.verify(refreshToken, (err, decoded) => {
      if (err) {
        throw new ApplicationError(err.message, 401);
      }
      userId = decoded.id;
    });
    const accessToken = await accessTokenRepository.get({
      where: {
        [Op.and]: [
          { token, refreshToken },
          {
            expired: false,
          },
        ],
      },
    });
    if (!accessToken) {
      throw new ApplicationError('token-not-found', httpCodes.NOT_FOUND);
    }
    await accessTokenRepository.update({ expired: true }, accessToken.id);
    const user = await usersRepository.getById(userId);
    return create({
      sub: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      iat: moment().unix(),
    });
  },
};
