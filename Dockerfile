FROM gcr.io/distroless/nodejs24-debian13

WORKDIR /app

COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]
