const { User } = require('../models');

module.exports = {
  list: (query) => User.findAndCountAll(query),
  getById: (id) => User.findByPk(id),
  get: (params) => User.findOne({ where: params }),
  create: (params) => User.create(params),
  update: (id, params) => User.update(params, { where: { id }, returning: true, plain: true }),
  destroy: (id) => User.destroy({ where: { id } }),
};
