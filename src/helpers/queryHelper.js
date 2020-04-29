module.exports.queryHelper = (options) => {
  const sort = options.sortBy;
  const limit = parseInt(options.perPage, 10);
  const offset = parseInt(options.page, 10);

  const query = {
    where: {},
    limit,
    offset: limit * (offset - 1),
  };

  const [sortKey, sortValue] = sort.trim().split(':');
  query.order = [[sortKey, sortValue]];

  return query;
};
