const moment = require('moment');
const { StatusCodes } = require('http-status-codes');

const { usersRepository } = require('../../repositories');
const { ApplicationError } = require('../../utils');
const { encryptor } = require('../../helpers');

module.exports.signin = async (email, password) => {
  const user = await usersRepository.get({ email });
  if (!user) {
    throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);
  }

  const isPasswordValid = await encryptor.comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApplicationError('Invalid Password', StatusCodes.UNAUTHORIZED);
  }

  const payload = {
    sub: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    iat: moment().unix(),
  };

  const token = await encryptor.generateToken(payload);

  return { token };
};
