FROM node:12-alpine

# set environmental variable to 80?

WORKDIR /usr/src/app

ENV PORT=80

EXPOSE 80/tcp

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "./server/server.js"]