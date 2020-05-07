import logger from '../logging';
import { AnnulleringClient } from './annulleringClient';
import { VedtakClient } from './vedtakClient';
import { Request, Response, Router } from 'express';

interface SetupOptions {
    vedtakClient: VedtakClient;
    annulleringClient: AnnulleringClient;
}

export default ({ vedtakClient, annulleringClient }: SetupOptions) => {
    const router = Router();

    router.post('/vedtak', (req: Request, res: Response) => {
        if (!req.body.behovId || req.body.godkjent === undefined) {
            res.status(400).send('BehovId og godkjent-verdi må være tilstede');
            return;
        }
        vedtakClient
            .postVedtak({
                behovId: req.body.behovId,
                godkjent: req.body.godkjent,
                speilToken: req.session!.speilToken,
                saksbehandlerIdent: req.session!.user
            })
            .then(() => res.sendStatus(204))
            .catch(err => {
                logger.error(`Feil under fatting av vedtak: ${err}`);
                res.status(500).send('Feil under fatting av vedtak');
            });
    });

    router.post('/annullering', (req: Request, res: Response) => {
        annulleringClient
            .annuller({
                aktørId: req.body.aktørId,
                fødselsnummer: req.body.fødselsnummer,
                organisasjonsnummer: req.body.organisasjonsnummer,
                fagsystemId: req.body.fagsystemId,
                saksbehandlerIdent: req.session!.user,
                speilToken: req.session!.speilToken,
                vedtaksperiodeId: req.body.vedtaksperiodeId
            })
            .then(() => {
                res.sendStatus(204);
            })
            .catch(err => {
                res.status(err.statusCode || 500).send('Feil under annullering');
            });
    });
    return router;
};
