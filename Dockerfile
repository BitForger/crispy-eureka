FROM node:8.11
WORKDIR /var/www/app/
COPY ./package* ./

RUN npm i
RUN npm i -g typescript

COPY . .

RUN tsc

COPY ./bin/start-server.sh /usr/local/bin/start-server

EXPOSE 80
CMD ["npm", "start"]

