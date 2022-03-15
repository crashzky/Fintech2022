FROM node:16

COPY package*.json ./

WORKDIR /usr/src/app

RUN npm install -g npm@8.5.4
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]