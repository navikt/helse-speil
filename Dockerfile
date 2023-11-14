FROM gcr.io/distroless/nodejs20-debian11

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"
ENV NODE_OPTIONS "--max-http-header-size=16000"

WORKDIR /app

COPY node_modules/ node_modules/
COPY dist/server/ dist/server/
COPY dist/client/ dist/client/

EXPOSE 3000

CMD ["/app/dist/server/server.js" ]
