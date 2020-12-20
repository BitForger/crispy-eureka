FROM node:10
WORKDIR /var/www/app/
COPY ./package* ./

RUN npm i
RUN npm i -g typescript

RUN mkdir ./dist
COPY ./dist ./dist/

COPY ./bin/start-server.sh /usr/local/bin/start-server

EXPOSE 80
CMD ["npm", "start"]

