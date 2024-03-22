import { Express } from 'express';

export const setUpFaro = (app: Express) => {
    app.use('/collect', (_req, res) => {
        res.sendStatus(200);
    });
};
