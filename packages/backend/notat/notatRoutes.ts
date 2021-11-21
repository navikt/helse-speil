import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { NotatClient } from './notatClient';

interface SetupOptions {
    notatClient: NotatClient;
}

export default ({ notatClient }: SetupOptions) => {
    const router = Router();

    router.post('/:vedtaksperiodeId', (req: SpeilRequest, res: Response) => {
        notatClient
            .postNotat(req.session!.speilToken, req.params.vedtaksperiodeId, req.body)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under postNotat: ${err}`);
                res.status(500).send('Feil under postNotat');
            });
    });

    router.put('/:vedtaksperiodeId/feilregistrer/:notatId', (req: SpeilRequest, res: Response) => {
        notatClient
            .feilregistrerNotat(req.session!.speilToken, req.params.vedtaksperiodeId, req.params.notatId)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under feilregistrerNotat: ${err}`);
                res.status(500).send('Feil under feilregistrerNotat');
            });
    });

    router.get('', (req: SpeilRequest, res: Response) => {
        const vedtaksperiode_ider = Array.isArray(req.query.vedtaksperiodeId)
            ? req.query.vedtaksperiodeId
            : [req.query.vedtaksperiodeId];
        if (vedtaksperiode_ider.length < 1) return res.status(400);

        return notatClient
            .getNotat(req.session!.speilToken, `vedtaksperiode_id=${vedtaksperiode_ider.join('&vedtaksperiode_id=')}`)
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.error(`Feil under getNotat: ${err}`);
                res.status(500).send(`Feil under getNotat`);
            });
    });

    return router;
};
