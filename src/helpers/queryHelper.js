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
  query.order = [[sortKey, sortValue]];

  return query;
};
