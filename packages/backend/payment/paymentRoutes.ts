import { Response, Router } from 'express';

import { SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { SpeilRequest } from '../types';
import { VedtakClient } from './vedtakClient';

interface SetupOptions {
    vedtakClient: VedtakClient;
    spesialistClient: SpesialistClient;
}

export default ({ vedtakClient, spesialistClient }: SetupOptions) => {
    const router = Router();

    router.post('/vedtak', (req: SpeilRequest, res: Response) => {
        const oppgavereferanse = req.body.oppgavereferanse;
        const saksbehandlerIdent = req.session!.user;
        if (
            !oppgavereferanse ||
            req.body.godkjent === undefined ||
            (req.body.godkjent === false && req.body.skjema === undefined)
        ) {
            res.status(400).send('Oppgavereferanse og godkjent-verdi må være tilstede');
            return;
        }

        const params = req.body.godkjent
            ? {
                  oppgavereferanse,
                  godkjent: true,
                  speilToken: req.session!.speilToken,
                  saksbehandlerIdent,
              }
            : {
                  oppgavereferanse,
                  godkjent: false,
                  speilToken: req.session!.speilToken,
                  saksbehandlerIdent,
                  årsak: req.body.skjema.årsak,
                  begrunnelser: req.body.skjema.begrunnelser,
                  kommentar: req.body.skjema.kommentar,
              };

        logger.info(`Sender vedtak for oppgavereferanse ${oppgavereferanse}`);

        vedtakClient
            .postVedtak(params)
            .then(() => res.sendStatus(204))
            .catch((err) => {
                logger.error(
                    `Feil under fatting av vedtak for ${saksbehandlerIdent}, oppgavereferanse ${oppgavereferanse}: ${err}`
                );

                const statusCode = err.statusCode === 409 ? 409 : 403 ? 403 : 500;
                res.status(statusCode).send('Feil under fatting av vedtak.');
            });
    });

    router.post('/annullering', (req: SpeilRequest, res: Response) => {
        logger.info(`Sender annullering for fagsystemId ${req.body.fagsystemId}`);
        logger.sikker.info(
            `Sender annullering for fagsystemId ${req.body.fagsystemId} med payload ${JSON.stringify(req.body)}`
        );
        const body = {
            aktørId: req.body.aktørId,
            fødselsnummer: req.body.fødselsnummer,
            organisasjonsnummer: req.body.organisasjonsnummer,
            fagsystemId: req.body.fagsystemId,
            saksbehandlerIdent: req.session!.user,
            vedtaksperiodeId: req.body.vedtaksperiodeId,
            begrunnelser: req.body.begrunnelser,
            kommentar: req.body.kommentar,
        };
        spesialistClient
            .execute({
                path: '/api/annullering',
                speilToken: req.session!.speilToken,
                body,
                method: 'post',
            })
            .then(() => res.sendStatus(204))
            .catch((err) => res.status(err.statusCode || 500).send('Feil under annullering'));
    });

    return router;
};
