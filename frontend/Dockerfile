FROM node:16

COPY package*.json ./

WORKDIR /usr/src/app

RUN npm install -g npm@8.5.4
RUN npm install

COPY . .

RUN npm run build
RUN npm i serve

EXPOSE 3000

CMD [ "npx", "serve", "-s", "build"]