const { ApplicationError } = require('../utils');

module.exports.queryHelper = (options) => {
  const sort = options.sortBy || 'createdAt:desc';
  const limit = parseInt(options.perPage || 10, 10);
  let offset = parseInt(options.page || 1, 10);

  offset = limit * (offset - 1);

  const query = {
    where: {},
    limit,
    offset,
  };

  const [sortKey, sortValue] = sort.trim().split(':');
  if (!['asc', 'desc'].includes(sortValue)) {
    throw new ApplicationError('Invalid Fields', 400, true, '', {
      query: { sortBy: "Sort order must be one of the following: 'asc' or 'desc'" },
    });
  }

  query.order = [[sortKey, sortValue]];

  return query;
};
