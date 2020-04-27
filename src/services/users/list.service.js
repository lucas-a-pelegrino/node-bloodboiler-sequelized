const { usersRepository } = require('../../repositories');
const { queryHelper } = require('../../helpers');

module.exports.list = async (options) => {
  const query = queryHelper(options);

  const { count, rows } = await usersRepository.list(query);

  return {
    metadata: {
      total: count,
      totalPages: Math.ceil(count / options.perPage),
      ...(options.page > 1 && { previousPage: options.page - 1 }),
      ...(options.page < count && { nextPage: options.page + 1 }),
    },
    data: rows,
  };
};
