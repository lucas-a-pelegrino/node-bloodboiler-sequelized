const httpCodes = require('http-status-codes');
const moment = require('moment');
const { Op } = require('sequelize');
const { jwt, ApplicationError } = require('../../utils');
const { messages } = require('../../helpers');
const { create } = require('../accessToken/create.service');
const { accessTokenRepository, usersRepository } = require('../../repositories');

module.exports = {
  refreshToken: async (token, refreshToken) => {
    let userId;
    jwt.verify(refreshToken, (err, decoded) => {
      if (err) {
        throw new ApplicationError(err.message, httpCodes.UNAUTHORIZED);
      }
      userId = decoded.sub.id;
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
      throw new ApplicationError(messages.notFound('token'), httpCodes.NOT_FOUND);
    }

    accessToken.expired = true;
    await accessTokenRepository.update(accessToken);

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
