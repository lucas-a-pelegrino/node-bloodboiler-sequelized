const { usersRepository } = require('../../repositories');
const { ApplicationError } = require('../../utils');
const { encryptor } = require('../../helpers');
const accessTokenService = require('../accessToken');

module.exports.signin = async (email, password) => {
  const user = await usersRepository.get({ email });
  if (!user) {
    throw new ApplicationError('User not found', 404);
  }

  const isPasswordValid = await encryptor.comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApplicationError('Invalid Password', 401);
  }

  const payload = {
    sub: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  return accessTokenService.create(payload);
};
