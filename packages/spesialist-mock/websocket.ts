import { Express } from 'express';
import expressWs, { Application } from 'express-ws';
import WebSocket from 'ws';

export const setUpWebSockets = (app: Express) => {
    const wsApp: Application = expressWs(app, undefined, { wsOptions: { clientTracking: true } }).app;
    wsApp.ws('/ws', (ws: WebSocket) => {
        console.info(`websocket-tilkobling åpnet`);
        ws.on('message', (event) => {
            console.log(`Melding mottatt per WS: ${event}`);
        });
        ws.on('close', () => {
            console.info(`websocket-tilkobling lukket`);
        });

        ws.send(JSON.stringify({ data: 'you are connected 👋' }));
    });
};
