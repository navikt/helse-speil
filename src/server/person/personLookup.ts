import authSupport from '../auth/authSupport';
import logger from '../logging';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import { SpesialistClient } from './spesialistClient';
import { AppConfig, OnBehalfOf } from '../types';
import { Request, Response } from 'express';
import { Storage } from '../tildeling/storage';

interface RespondWithParameters {
    res: Response;
    lookupPromise: Promise<any>;
    mapper: (res: Body) => Promise<any>;
    operation: string;
    speilUser: string;
}

export interface SetupParameters {
    spesialistClient: SpesialistClient;
    storage: Storage;
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const personIdHeaderName = 'nav-person-id';
let spesialistClient: SpesialistClient;
let storage: Storage;
let spesialistId: string;

let onBehalfOf: OnBehalfOf;

const setup = ({
    spesialistClient: _spesialistClient,
    storage: _storage,
    config,
    onBehalfOf: _onBehalfOf,
}: SetupParameters) => {
    spesialistClient = _spesialistClient;
    storage = _storage;
    spesialistId = config.oidc.clientIDSpesialist;
    onBehalfOf = _onBehalfOf;
};

const finnPerson = async (req: Request, res: Response) => {
    const undeterminedId = req.headers[personIdHeaderName] as string;

    auditLog(req, undeterminedId || 'missing person id');
    if (!undeterminedId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    const lookupPromise = erGyldigFødselsnummer(undeterminedId)
        ? spesialistClient.hentPersonByFødselsnummer
        : spesialistClient.hentPersonByAktørId;

    // Hacky siden tildeling skal flyttes til Spesialist
    const finnTildeling = async (response: Body): Promise<string | null> => {
        const person: any = response.body;
        const oppgavereferanse = person.arbeidsgivere[0].vedtaksperioder.find(
            (v: any) => v.oppgavereferanse && v.oppgavereferanse !== 'null'
        )?.oppgavereferanse;
        return oppgavereferanse ? await storage.get(oppgavereferanse) : null;
    };

    return respondWith({
        res,
        lookupPromise: onBehalfOf.hentFor(spesialistId, req.session!.speilToken).then((token: string) => {
            return lookupPromise(undeterminedId, token);
        }),
        mapper: async (response: Body) => ({
            person: { ...response.body, tildeltTil: await finnTildeling(response) },
        }),
        operation: 'finnPerson',
        speilUser: speilUser(req),
    });
};

const oppgaverForPeriode = (req: Request, res: Response) => {
    auditLogOversikt(req);

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spesialistId, req.session!.speilToken)
            .then((behalfOfToken) => spesialistClient.behandlingerForPeriode(behalfOfToken)),
        mapper: async (response: Body) => ({
            oppgaver: response.body,
        }),
        operation: 'oversikt',
        speilUser: speilUser(req),
    });
};

const auditLog = (req: Request, ...params: string[]) => {
    logger.audit(`${speilUser(req)} is doing lookup with params: ${params.join(', ')}`);
};

const speilUser = (req: Request) => authSupport.valueFromClaim('name', req.session!.speilToken);

const auditLogOversikt = (req: Request) => {
    logger.audit(`${speilUser(req)} is viewing front page`);
};

const respondWith = ({ res, lookupPromise, mapper, operation, speilUser }: RespondWithParameters) => {
    return lookupPromise
        .then(async (apiResponse) => {
            if (apiResponse === undefined) {
                logger.error('[${speilUser}] Unexpected error, missing apiResponse value');
                res.sendStatus(503);
            } else {
                res.status(apiResponse.statusCode).send(await mapper(apiResponse));
            }
        })
        .catch((err) => {
            logger.error(`[${speilUser}] Error during data fetching for ${operation}: ${err}`);
            res.sendStatus(err.statusCode || 503);
        });
};

module.exports = {
    setup,
    finnPerson,
    oppgaverForPeriode,
    personIdHeaderName,
};

export default {
    setup,
    finnPerson,
    oppgaverForPeriode,
    personIdHeaderName,
};
