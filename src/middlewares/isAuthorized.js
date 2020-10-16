const { StatusCodes } = require('http-status-codes');
const { jwt, catchAsync, ApplicationError } = require('../utils');
const { usersRepository } = require('../repositories');

module.exports = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    const [scheme, credentials] = req.headers.authorization.split(' ');

    if (scheme.match(/^Bearer$/i)) {
      token = credentials;
    } else {
      throw new ApplicationError('Invalid Authorization Format', StatusCodes.UNAUTHORIZED);
    }
  } else {
    throw new ApplicationError('Missing Authorization', StatusCodes.UNAUTHORIZED);
  }

  let userId;
  jwt.verify(token, (err, decoded) => {
    if (err) {
      throw new ApplicationError(err.message, StatusCodes.UNAUTHORIZED);
    }

    userId = decoded.sub.id;
  });

  const decodedUser = await usersRepository.getById(userId);

  if (!decodedUser) {
    throw new ApplicationError('User Not Found', StatusCodes.NOT_FOUND);
  }

  req.session = { token, id: decodedUser.id, email: decodedUser.email };

  next();
});
