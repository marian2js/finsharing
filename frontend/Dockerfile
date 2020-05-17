FROM node:14
MAINTAINER marian2js

COPY . /app/finsharing
WORKDIR /app/finsharing/frontend

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]

EXPOSE 3000
