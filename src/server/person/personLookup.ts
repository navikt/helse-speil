import authSupport from '../auth/authSupport';
import logger from '../logging';
import moment from 'moment';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import { AktørIdLookup } from '../aktørid/aktørIdLookup';
import { SpesialistClient } from './spesialistClient';
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
    operation: string;
    speilUser: string;
}

interface SetupParameters {
    aktørIdLookup: AktørIdLookup;
    spesialistClient: SpesialistClient;
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const personIdHeaderName = 'nav-person-id';
let aktørIdLookup: AktørIdLookup;
let spesialistClient: SpesialistClient;
let spesialistId: string;

let onBehalfOf: OnBehalfOf;

const setup = ({
    aktørIdLookup: _aktørIdLookup,
    spesialistClient: _spesialistClient,
    config,
    onBehalfOf: _onBehalfOf
}: SetupParameters) => {
    aktørIdLookup = _aktørIdLookup;
    spesialistClient = _spesialistClient;
    spesialistId = config.oidc.clientIDSpesialist;
    onBehalfOf = _onBehalfOf;
};

const finnPerson = async (req: Request, res: Response) => {
    const undeterminedId = req.headers[personIdHeaderName] as string;
    const innsyn = req.headers['innsyn'] === 'true';

    auditLog(req, undeterminedId || 'missing person id');
    if (!undeterminedId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    const lookupPromise = innsyn
        ? spesialistClient.hentSakByUtbetalingsref
        : erGyldigFødselsnummer(undeterminedId)
        ? spesialistClient.hentPersonByFødselsnummer
        : spesialistClient.hentPersonByAktørId;

    return respondWith({
        res,
        lookupPromise: onBehalfOf.hentFor(spesialistId, req.session!.speilToken).then((token: string) => {
            return lookupPromise(undeterminedId, token);
        }),
        mapper: (response: Body) => ({
            person: response.body
        }),
        operation: 'finnPerson',
        speilUser: speilUser(req)
    });
};

const behovForPeriode = (req: Request, res: Response) => {
    auditLogOversikt(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spesialistId, req.session!.speilToken)
            .then(behalfOfToken => spesialistClient.behandlingerForPeriode(yesterday, today, behalfOfToken)),
        mapper: (response: Body) => ({
            behov: response.body
        }),
        operation: 'oversikt',
        speilUser: speilUser(req)
    });
};

const auditLog = (req: Request, ...queryParams: string[]) => {
    logger.audit(
        `${speilUser(req)} is doing lookup with params: ${queryParams?.reduce(
            (previous: string, current: string | string[]) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const speilUser = (req: Request) => authSupport.valueFromClaim('name', req.session!.speilToken);

const auditLogOversikt = (req: Request) => {
    logger.audit(`${speilUser(req)} is viewing front page`);
};

const toAktørId = async (fnr: string) => {
    return await aktørIdLookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const respondWith = ({ res, lookupPromise, mapper, operation, speilUser }: RespondWithParameters) => {
    return lookupPromise
        .then(apiResponse => {
            if (apiResponse === undefined) {
                logger.error('[${speilUser}] Unexpected error, missing apiResponse value');
                res.sendStatus(503);
            } else {
                res.status(apiResponse.statusCode).send(mapper(apiResponse));
            }
        })
        .catch(err => {
            logger.error(`[${speilUser}] Error during data fetching for ${operation}: ${err}`);
            res.sendStatus(err.statusCode || 503);
        });
};

module.exports = {
    setup,
    finnPerson,
    behovForPeriode,
    personIdHeaderName
};

export default {
    setup,
    finnPerson,
    behovForPeriode,
    personIdHeaderName
};
