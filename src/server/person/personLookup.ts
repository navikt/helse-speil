import authSupport from '../auth/authSupport';
import logger from '../logging';
import moment from 'moment';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import spleis from './spleisClient';
import { AktørIdLookup } from '../aktørid/aktørIdLookup';
import { SpadeClient } from '../adapters/spadeClient';
import { AppConfig, OnBehalfOf } from '../types';
import { Request, Response } from 'express';

interface RespondWithParameters {
    res: Response;
    lookupPromise: Promise<any>;
    mapper: (
        res: Body
    ) => {
        person?: ReadableStream<Uint8Array> | null;
        behov?: ReadableStream<Uint8Array> | null;
    };
}

interface SetupParameters {
    aktørIdLookup: AktørIdLookup;
    spadeClient: SpadeClient;
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const personIdHeaderName = 'nav-person-id';
let aktørIdLookup: AktørIdLookup;
let spadeClient: SpadeClient;
let spleisId: string;
let spadeId: string;

let onBehalfOf: OnBehalfOf;

const setup = ({
    aktørIdLookup: _aktørIdLookup,
    spadeClient: _spadeClient,
    config,
    onBehalfOf: _onBehalfOf
}: SetupParameters) => {
    aktørIdLookup = _aktørIdLookup;
    spadeClient = _spadeClient;
    spleisId = config.oidc.clientIDSpleis;
    spadeId = config.oidc.clientIDSpade;
    onBehalfOf = _onBehalfOf;
};

const sakSøk = async (req: Request, res: Response) => {
    const undeterminedId = req.headers[personIdHeaderName] as string;
    const innsyn = req.headers['innsyn'] === 'true';

    auditLog(req, undeterminedId || 'missing person id');
    if (!undeterminedId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    const aktørId = erGyldigFødselsnummer(undeterminedId)
        ? await toAktørId(undeterminedId)
        : undeterminedId;
    if (!aktørId) {
        return res.status(404).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
    }

    return respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spleisId, req.session!.speilToken)
            .then((token: string) => {
                return (innsyn ? spleis.hentSakByUtbetalingsref : spleis.hentSak)(aktørId, token);
            }),
        mapper: (response: Body) => ({
            person: response.body
        })
    });
};

const behovForPeriode = (req: Request, res: Response) => {
    auditLog(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spadeId, req.session!.speilToken)
            .then(behalfOfToken =>
                spadeClient.behandlingerForPeriode(yesterday, today, behalfOfToken)
            ),
        mapper: (response: Body) => ({
            behov: response.body
        })
    });
};

const auditLog = (req: Request, ...queryParams: string[]) => {
    const speilUser = authSupport.valueFromClaim('name', req.session!.speilToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams?.reduce(
            (previous: string, current: string | string[]) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const toAktørId = async (fnr: string) => {
    return await aktørIdLookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const respondWith = ({ res, lookupPromise, mapper }: RespondWithParameters) => {
    return lookupPromise
        .then(apiResponse => {
            if (apiResponse === undefined) {
                logger.error('Unexpected error, missing apiResponse value');
                res.sendStatus(503);
            } else {
                res.status(apiResponse.statusCode).send(mapper(apiResponse));
            }
        })
        .catch(err => {
            logger.error(`Error during data fetching: ${err}`);
            res.sendStatus(err.statusCode || 503);
        });
};

module.exports = {
    setup,
    sakSøk,
    behovForPeriode,
    personIdHeaderName
};

export default {
    setup,
    sakSøk,
    behovForPeriode,
    personIdHeaderName
};
