FROM node:16-alpine as builder

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install --production

ARG REACT_APP_RPC_URL

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html