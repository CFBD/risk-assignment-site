FROM node:12-buster

RUN mkdir -p /home/node/risk-assignment-site/node_modules && mkdir -p /home/node/risk-assignment-siten/dist && chown -R node:node /home/node/risk-assignment-site

WORKDIR /home/node/risk-assignment-site

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY . .
COPY --chown=node:node . .

RUN npm run build

RUN chmod -R 777 ./dist

USER node

COPY setup.sh /usr/local/bin/

ENTRYPOINT [ "setup.sh" ]

EXPOSE 8080

CMD [ "pm2-runtime", "index.js" ]
