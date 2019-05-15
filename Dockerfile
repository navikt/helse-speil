FROM navikt/node-express:12.2.0

WORKDIR /app
COPY package.json /app
COPY src/server/*.js /app/
COPY dist/ /app/dist/

RUN npm install

EXPOSE 3000
