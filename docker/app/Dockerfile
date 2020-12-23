# DEVELOPMENT
FROM node:lts-alpine AS development

ENV APP_FOLDER /home/node/app

RUN mkdir $APP_FOLDER \
	&& chown -R node $APP_FOLDER

RUN apk update \
	&& apk upgrade

USER node

WORKDIR $APP_FOLDER

COPY --chown=node package*.json ./

RUN npm install && npm cache clean --force

COPY --chown=node . .

# PRODUCTION
FROM node:lts-alpine3.12 AS production

ENV APP_FOLDER /home/node/app

RUN apk update \
	&& apk upgrade

USER node

WORKDIR $APP_FOLDER

COPY --chown=node package*.json ./

RUN npm install --only=production

COPY --chown=node . .

CMD ["NODE_ENV=production", "node", "app.js"]
