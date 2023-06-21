FROM ghcr.io/navikt/node-express:16

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"

WORKDIR /app

COPY packages/backend/node_modules/ node_modules/
COPY dist/server/ dist/server/
COPY dist/client/ dist/client/

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh", "node --max-http-header-size=16000 /app/dist/server/server.js" ]
