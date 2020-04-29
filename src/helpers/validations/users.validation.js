const yup = require('yup');

const list = {
  query: yup.object().shape({
    page: yup
      .number()
      .integer()
      .default(1),
    perPage: yup
      .number()
      .integer()
      .default(10),
    sortBy: yup
      .string()
      .default('createdAt:desc')
      .matches(/[:](asc|desc)/i, "sorting order must be one of the following: 'asc' or 'desc'"),
  }),
};

const get = {
  params: yup.object().shape({
    id: yup.number().integer(),
  }),
};

const create = {
  body: yup.object().shape({
    name: yup.string().required(),
    email: yup
      .string()
      .email()
      .required(),
    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/,
        'password must have lower and upper letters, at least one number, and at least one special character',
      )
      .required(),
  }),
};

const update = {
  params: yup.object().shape({
    id: yup.number().integer(),
  }),
  body: yup.object().shape({
    name: yup.string(),
    email: yup.string().email(),
    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/,
        'password must have lower and upper letters, at least one number, and at least one special character',
      ),
  }),
};

const destroy = {
  params: yup.object().shape({
    id: yup.number().integer(),
  }),
};

module.exports.users = {
  list,
  get,
  create,
  update,
  destroy,
};
