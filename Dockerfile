### STAGE 1: Build ###

FROM node:8.12.0-alpine as build

WORKDIR /app

COPY gulpfile.js .
COPY package.json .
COPY package-lock.json .

RUN npm i

COPY src ./src

RUN npm run build

### STAGE 2: Setup & Run ###

FROM node:8.12.0-alpine

WORKDIR /app

RUN npm install express
COPY server.js .
COPY package.json .
COPY --from=build /app/dist ./public

CMD ["npm", "run", "serve"]