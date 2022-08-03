FROM node:13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

# Development
# RUN npm install -g nodemon
# CMD ["npm", "run", "dev"]

# Production
RUN npm install -g pm2
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
