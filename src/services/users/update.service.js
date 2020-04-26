const { usersRepository } = require('../../repositories');
const { ApplicationError } = require('../../utils');

module.exports.update = async (id, body) => {
  const user = await usersRepository.getById(id);
  if (!user) {
    throw new ApplicationError('User not found', 404);
  }

  // eslint-disable-next-line no-unused-vars
  const [rowsUpdated, userUpdated] = await usersRepository.update(id, body);

  return userUpdated;
};
