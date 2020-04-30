const { logger } = require('../../utils');
const models = require('../../models');

module.exports = async () => {
  try {
    await models.sequelize.sync();
    await models.sequelize.close();
    logger.info('Test db cleared and disconnected successfully.');
    process.exit();
  } catch (error) {
    throw new Error(error);
  }
};
