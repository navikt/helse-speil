import logger from '../logging';
import annulleringInit, { Annullering } from './annuller';
import { VedtakClient } from './vedtakClient';
import { Request, Response, Router } from 'express';
import { AppConfig, OnBehalfOf } from '../types';

interface SetupOptions {
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
    vedtakClient: VedtakClient;
}

const router = Router();
let annullering: Annullering;
let vedtakClient: VedtakClient;
let onBehalfOf: OnBehalfOf;
let config: AppConfig;

const setup = ({ config: _config, onBehalfOf: _onBehalfOf, vedtakClient: _vedtakClient }: SetupOptions) => {
    annullering = annulleringInit.setup(_config.nav);
    vedtakClient = _vedtakClient;
    routes(router);
    onBehalfOf = _onBehalfOf;
    config = _config;
    return router;
};

const routes = (router: Router) => {
    const vedtakHandler = {
        handle: (req: Request, res: Response) => {
            if (
                !(req.body.behovId || req.body.vedtaksperiodeId) ||
                !req.body.aktørId ||
                req.body.godkjent === undefined
            ) {
                res.status(400).send('BehovId eller vedtaksperiodeId, aktørId og godkjent-verdi må være tilstede');
                return;
            }
            vedtakClient
                .postVedtak({
                    behovId: req.body.behovId,
                    aktørId: req.body.aktørId,
                    vedtaksperiodeId: req.body.vedtaksperiodeId,
                    saksbehandlerIdent: req.session!.user,
                    godkjent: req.body.godkjent,
                    speilToken: req.session!.speilToken
                })
                .then(() => res.sendStatus(204))
                .catch(err => {
                    logger.error(`Feil under fatting av vedtak: ${err}`);
                    res.status(500).send('Feil under fatting av vedtak');
                });
        }
    };

    const annulleringHandler = {
        handle: (req: Request, res: Response) => {
            if (!req.body.utbetalingsreferanse || !req.body.aktørId || !req.body.fødselsnummer) {
                res.status(400).send('Både utbetalingsreferanse, aktørId og fnr må være tilstede');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devAnnullering(req, res);
            } else {
                prodAnnullering(req, res);
            }
        }
    };

    router.post('/vedtak', vedtakHandler.handle);
    router.post('/annullering', annulleringHandler.handle);
};

const prodAnnullering = async (req: Request, res: Response) => {
    const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpenn, req.session!.speilToken);
    annullering
        .annuller(
            {
                utbetalingsreferanse: req.body.utbetalingsreferanse,
                aktørId: req.body.aktørId,
                saksbehandler: req.session!.user,
                fødselsnummer: req.body.fødselsnummer
            },
            onBehalfOfToken
        )
        .then(() => {
            logger.info(
                `Annullering for sak med utbetalingsreferanse ${req.body.utbetalingsreferanse} sendt inn av ${
                    req.session!.user
                }`
            );
            res.status(204).send();
        })
        .catch(err => {
            logger.error(`Feil under annullering: ${err}`);
            res.status(err.statusCode || 500).send('Feil under annullering');
        });
};

const devAnnullering = (_req: Request, res: Response) => {
    if (Math.random() > 0.5) {
        res.status(204).send();
    } else {
        res.status(500).send('Feil under annullering');
    }
};

export default { setup };
