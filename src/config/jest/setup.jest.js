const { logger } = require('../../utils');
const models = require('../../models');

module.exports = async () => {
  try {
    await models.sequelize.sync();
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
