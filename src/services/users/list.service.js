const { usersRepository } = require('../../repositories');
const { queryHelper } = require('../../helpers');

module.exports.list = async (options) => {
  const query = queryHelper(options);

  const { count, rows } = await usersRepository.list(query);

  return {
    metadata: {
      total: count,
      currentPage: options.page,
      totalPages: Math.ceil(count / options.perPage),
    },
    data: rows,
  };
};
