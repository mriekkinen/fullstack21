FROM node:14-alpine
ENV NODE_ENV=production

RUN apk add --no-cache --update bash tree

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY index.js ./
COPY build ./build/

RUN adduser -D docker
USER docker

CMD [ "npm", "start" ]
