import { Express } from 'express';

export const setUpModia = (app: Express) => {
    app.use('/api/context', (_req, res) => {
        res.sendStatus(200);
    });
};
