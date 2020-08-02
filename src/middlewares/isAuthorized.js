const { Op } = require('sequelize');
const { jwt, catchAsync, ApplicationError } = require('../utils');
const { accessTokenRepository } = require('../repositories');

module.exports = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    const [scheme, credentials] = req.headers.authorization.split(' ');

    if (scheme.match(/^Bearer$/i)) {
      token = credentials;
    } else {
      throw new ApplicationError('Invalid Authorization Format', 401);
    }
  } else {
    throw new ApplicationError('Missing Authorization', 401);
  }

  let decoded;
  jwt.verify(token, (err, decodedToken) => {
    if (err) {
      throw new ApplicationError(err.message, 401);
    }

    decoded = decodedToken;
  });
  const accessToken = await accessTokenRepository.get({
    where: { [Op.and]: [{ token }, { expired: false }] },
  });
  if (!accessToken) {
    throw new ApplicationError('Token Not Found', 404);
  }

  req.session = { token, id: decoded.id, email: decoded.email };

  next();
});
