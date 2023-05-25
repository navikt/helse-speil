import { Response, Router } from 'express';

import { SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    spesialistClient: SpesialistClient;
}

type PostVedtakOptions = {
    oppgavereferanse: string;
    godkjent: boolean;
    saksbehandlerIdent: string;
};

type PostVedtakAvslåttOptions = PostVedtakOptions & {
    årsak: string;
    begrunnelser?: string[];
    kommentar?: string;
};

export default ({ spesialistClient }: SetupOptions) => {
    const router = Router();

    router.post('/vedtak', (req: SpeilRequest, res: Response) => {
        const oppgavereferanse = req.body.oppgavereferanse;
        const saksbehandlerIdent = req.session!.user;
        const godkjent = req.body.godkjent;
        if (!oppgavereferanse || godkjent === undefined || (godkjent === false && req.body.skjema === undefined)) {
            res.status(400).send('Oppgavereferanse og godkjent-verdi må være tilstede');
            return;
        }
        const body: PostVedtakOptions | PostVedtakAvslåttOptions = {
            oppgavereferanse,
            godkjent,
            saksbehandlerIdent,
            ...req.body.skjema,
        };

        logger.info(`Sender vedtak for oppgavereferanse ${oppgavereferanse}`);

        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/vedtak`,
                body,
                method: 'post',
            })
            .then(() => res.sendStatus(204))
            .catch((err) => {
                logger.sikker.error(
                    `Feil under fatting av vedtak for ${saksbehandlerIdent}, oppgavereferanse ${oppgavereferanse}: ${err}`,
                );
                const statusCode = [400, 403, 409].includes(err.statusCode) ? err.statusCode : 500;
                res.status(statusCode).send(err.error?.feilkode ?? 'ingen_feilkode');
            });
    });

    router.post('/annullering', (req: SpeilRequest, res: Response) => {
        logger.info(`Sender annullering for fagsystemId ${req.body.fagsystemId}`);
        logger.sikker.info(
            `Sender annullering for fagsystemId ${req.body.fagsystemId} med payload ${JSON.stringify(req.body)}`,
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
