#FROM node:16-alpine
FROM jrottenberg/ffmpeg:4.1-alpine as ffmpeg
FROM node:lts-alpine

COPY --from=ffmpeg / /

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install

COPY ./index.js ./

EXPOSE 3001

CMD ["node", "index.js"];
