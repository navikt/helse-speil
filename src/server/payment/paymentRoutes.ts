import fs from 'fs';
import logger from '../logging';
import input from './inputHandler';
import annulleringInit, { Annullering } from './annuller';
import simuleringInit, { Simulering } from './simulering';
import { postVedtak } from './vedtak';
import { Request, Response, Router } from 'express';
import { AppConfig, OnBehalfOf } from '../types';
import { Utbetalingsvedtak } from '../../types';

interface SetupOptions {
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const router = Router();
let simulering: Simulering;
let annullering: Annullering;
let onBehalfOf: OnBehalfOf;
let config: AppConfig;

const setup = ({ config: _config, onBehalfOf: _onBehalfOf }: SetupOptions) => {
    simulering = simuleringInit.setup(_config.nav);
    annullering = annulleringInit.setup(_config.nav);
    routes(router);
    onBehalfOf = _onBehalfOf;
    config = _config;
    return router;
};

const routes = (router: Router) => {
    const simulationHandler = {
        handle: (req: Request, res: Response) => {
            const sak = input.map(req.body);
            const validationResult = input.validate(sak);
            if (!validationResult.result) {
                logger.info(`Valideringsfeil ved forsøk på simulering: ${validationResult.errors.join(' ')}`);
                res.status(400).send({ valideringsfeil: validationResult.errors });
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devSimulation(req, res);
            } else {
                prodSimulation(req, res, sak);
            }
        }
    };

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
            if (process.env.NODE_ENV === 'development') {
                devSendVedtak(req, res);
            } else {
                prodSendVedtak(req, res);
            }
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

    router.post('/simulate', simulationHandler.handle);
    router.post('/vedtak', vedtakHandler.handle);
    router.post('/annullering', annulleringHandler.handle);
};

const prodSimulation = async (req: Request, res: Response, vedtak: Utbetalingsvedtak) => {
    const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpenn, req.session!.speilToken);
    simulering
        .simuler(vedtak, onBehalfOfToken)
        .then(reply => {
            res.set('Content-Type', 'application/json');
            res.send(reply);
        })
        .catch(err => {
            logger.error(`Error while simulating payment: ${err}`);
            res.status(500).send('Error while simulating payment');
        });
};

const devSimulation = (req: Request, res: Response) => {
    const mockSpennData = JSON.parse(readMockData());
    res.json(mockSpennData);
};

const prodSendVedtak = async (req: Request, res: Response) => {
    const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpade, req.session!.speilToken);
    postVedtak({
        behovId: req.body.behovId,
        aktørId: req.body.aktørId,
        vedtaksperiodeId: req.body.vedtaksperiodeId,
        saksbehandlerIdent: req.session!.user,
        accessToken: onBehalfOfToken,
        godkjent: req.body.godkjent
    })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            logger.error(`Feil under fatting av vedtak: ${err}`);
            res.status(500).send('Feil under fatting av vedtak');
        });
};

const devSendVedtak = (req: Request, res: Response) => {
    if (Math.random() > 0.5) {
        res.status(204).send();
    } else {
        res.status(500).send('Feil under fatting av vedtak');
    }
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

const devAnnullering = (req: Request, res: Response) => {
    if (Math.random() > 0.5) {
        res.status(204).send();
    } else {
        res.status(500).send('Feil under annullering');
    }
};

const readMockData = () => fs.readFileSync('__mock-data__/spenn-reply.json', 'utf-8');

export default { setup };
