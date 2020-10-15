FROM node:8.12.0-alpine

WORKDIR /app

COPY package.json .

RUN npm i

COPY gulpfile.js .

CMD ["npm", "start"]