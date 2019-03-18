FROM node:11-alpine

WORKDIR /usr/src/app

RUN apk add --update \
    python \
    build-base

COPY package.json .
COPY package-lock.json .

RUN npm i
COPY . .
RUN npm run build && rm -rf ./node_modules/ && npm i --production

EXPOSE 3000
CMD node build/index.js
