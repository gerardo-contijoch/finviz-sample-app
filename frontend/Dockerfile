FROM node:current-alpine3.19

ENV NODE_VERSION=20.11.1

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

#puerto por defecto de vite
EXPOSE 5173
