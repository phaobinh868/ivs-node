FROM node:13-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .
# Development
RUN npm install -g nodemon
CMD ["npm", "run", "dev"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]