import { Express } from 'express';
import { v4 as uuid } from 'uuid';

export const setUpFlexjar = (app: Express) => {
    app.use('/api/azure/v2/feedback', (_req, res) => {
        res.status(200).send({ id: uuid() });
    });
};
