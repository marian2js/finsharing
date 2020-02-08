FROM node:12
MAINTAINER marian2js

COPY . /app/finsharing
WORKDIR /app/finsharing/backend

RUN npm install -g forever
RUN npm i
CMD npm run start:production

EXPOSE 8000
