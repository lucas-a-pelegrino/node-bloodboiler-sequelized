const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const swagger = require('swagger-ui-express');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const routes = require('../../routes');
const swaggerDocs = require('../swagger/swagger.json');
const { errorTracker, errorHandler } = require('../../middlewares');
const { ApplicationError, logger, morgan } = require('../../utils');
const { messages } = require('../../helpers');

const { port, version, corsOptions } = require('../env');

const app = express();

app.set('port', port || 3000);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(xss());

app.use(`/api/${version}/documentation`, swagger.serve);
app.use(`/api/${version}/documentation`, swagger.setup(swaggerDocs));

Object.keys(routes).forEach((key) => app.use(`/api/${version}/${key}`, routes[key]));

app.use((req, res, next) => {
  next(new ApplicationError(messages.notFound('route'), StatusCodes.NOT_FOUND));
});

app.use(errorTracker);
app.use(errorHandler);

const unexpectedErrorCatcher = (error) => {
  logger.error(error);
  process.exit(1);
};

process.on('unhandledRejection', unexpectedErrorCatcher);
process.on('uncaughtException', unexpectedErrorCatcher);

module.exports = app;
