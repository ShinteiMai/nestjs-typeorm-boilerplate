FROM node:14-alpine

WORKDIR /usr/src/app

# 0. Installing app dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn && yarn cache clean

# 1. Bundle app source
COPY . .

# 2. Expose port and start application
EXPOSE 8080
CMD ["yarn", "start:prod"]  