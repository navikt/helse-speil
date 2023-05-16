import { Response, Router } from 'express';

import { SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    spesialistClient: SpesialistClient;
}

export default ({ spesialistClient }: SetupOptions) => {
    const router = Router();

    router.post('/:vedtaksperiodeId', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/notater/${req.params.vedtaksperiodeId}`,
                body: req.body,
                method: 'post',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under postNotat: ${err}`);
                res.sendStatus(err.statusCode ?? 500);
            });
    });

    router.put('/:vedtaksperiodeId/feilregistrer/:notatId', (req: SpeilRequest, res: Response) => {
        const vedtaksperiodeId = req.params.vedtaksperiodeId;
        const notatId = req.params.notatId;
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/notater/${vedtaksperiodeId}/feilregistrer/${notatId}`,
                method: 'put',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under feilregistrerNotat: ${err}`);
                res.sendStatus(err.statusCode ?? 500);
            });
    });

    router.get('', (req: SpeilRequest, res: Response) => {
        const vedtaksperiode_ider = Array.isArray(req.query.vedtaksperiodeId)
            ? req.query.vedtaksperiodeId
            : [req.query.vedtaksperiodeId];
        if (vedtaksperiode_ider.length < 1) return res.status(400);
        const query = `vedtaksperiode_id=${vedtaksperiode_ider.join('&vedtaksperiode_id=')}`;
        return spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/notater?${query}`,
                method: 'get',
            })
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.error(`Feil under getNotat: ${err}`);
                res.sendStatus(err.statusCode ?? 500);
            });
    });

    return router;
};
