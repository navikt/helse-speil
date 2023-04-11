import { Response, Router } from 'express';

import logger from '../logging';
import { TotrinnsvurderingClient } from '../payment/totrinnsvurderingClient';
import { SpeilRequest } from '../types';

interface SetupOptions {
    totrinnsvurderingClient: TotrinnsvurderingClient;
}

export default ({ totrinnsvurderingClient }: SetupOptions) => {
    const router = Router();

    router.post('', (req: SpeilRequest, res: Response) => {
        logger.info(`Sender til totrinnsvurdering for oppgavereferanse ${req.body.oppgavereferanse}`);
        totrinnsvurderingClient
            .totrinnsvurdering(req.session!.speilToken, {
                oppgavereferanse: req.body.oppgavereferanse,
            })
            .then(() => {
                res.sendStatus(204);
            })
            .catch((err) => {
                logger.info(
                    `Feil under sending av totrinnsvurdering for oppgavereferanse ${req.body.oppgavereferanse}, statuskode: ${err.statusCode}`
                );
                res.status(err.statusCode || 500).send('Feil under sending av totrinnsvurdering');
            });
    });

    router.post('/retur', (req: SpeilRequest, res: Response) => {
        logger.info(`Sender beslutteroppgave i retur for oppgavereferanse ${req.body.oppgavereferanse}`);
        totrinnsvurderingClient
            .beslutteroppgaveretur(req.session!.speilToken, {
                oppgavereferanse: req.body.oppgavereferanse,
                notat: req.body.notat,
            })
            .then(() => {
                res.sendStatus(204);
            })
            .catch((err) => {
                logger.info(
                    `Feil under sending av beslutteroppgave i retur for oppgavereferanse ${req.body.oppgavereferanse}, statuskode: ${err.statusCode}`
                );
                res.status(err.statusCode || 500).send('Feil under sending av beslutteroppgave i retur');
            });
    });

    return router;
};
