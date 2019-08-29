FROM navikt/node-express:12.2.0-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY dist/server/ /app/dist/server/
COPY dist/client/ /app/dist/client/

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh", "node /app/dist/server/server.js" ]
