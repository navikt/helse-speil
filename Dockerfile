FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY .next/standalone/node_modules /app/node_modules
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]
