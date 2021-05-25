import { Response } from 'express';

import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import authSupport from '../auth/authSupport';
import logger from '../logging';
import { AppConfig, OnBehalfOf, SpeilRequest } from '../types';
import { SpesialistClient } from './spesialistClient';

export interface SetupParameters {
    spesialistClient: SpesialistClient;
    config: AppConfig;
    onBehalfOf: OnBehalfOf;
}

const personIdHeaderName = 'nav-person-id';
let spesialistClient: SpesialistClient;
let spesialistId: string;

let onBehalfOf: OnBehalfOf;

const setup = ({ spesialistClient: _spesialistClient, config, onBehalfOf: _onBehalfOf }: SetupParameters) => {
    spesialistClient = _spesialistClient;
    spesialistId = config.oidc.clientIDSpesialist;
    onBehalfOf = _onBehalfOf;
};

const finnPerson = async (req: SpeilRequest, res: Response) => {
    const undeterminedId = req.headers[personIdHeaderName] as string;

    auditLog(req, undeterminedId || 'missing person id');
    if (!undeterminedId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        logger.sikker.error(`Missing header '${personIdHeaderName}' in request`, {
            request: logger.requestMeta(req),
        });
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    const lookupPromise = erGyldigFødselsnummer(undeterminedId)
        ? spesialistClient.hentPersonByFødselsnummer
        : spesialistClient.hentPersonByAktørId;

    return onBehalfOf
        .hentFor(spesialistId, req.session.speilToken)
        .then((token: string) => lookupPromise(undeterminedId, token))
        .then(async (apiResponse: any) => {
            res.status(apiResponse.status).send({
                person: {
                    ...apiResponse.body,
                },
            });
        })
        .catch((err) => {
            logger.error(`[${speilUser(req)}] Error during data fetching for finnPerson (se sikkerLogg for detaljer)`);
            logger.sikker.error(
                `[${speilUser(req)}] Error during data fetching for finnPerson: ${JSON.stringify(err)}`,
                {
                    error: err,
                    request: logger.requestMeta(req),
                }
            );
            res.sendStatus(err.status || 503);
        });
};

const oppgaverForPeriode = (req: SpeilRequest, res: Response) => {
    auditLogOversikt(req);

    onBehalfOf
        .hentFor(spesialistId, req.session!.speilToken)
        .then((behalfOfToken) => spesialistClient.behandlingerForPeriode(behalfOfToken))
        .then(async (apiResponse) => {
            res.status(apiResponse.status).send({
                oppgaver: await apiResponse.body,
            });
        })
        .catch((err) => {
            logger.error(`[${speilUser(req)}] Error during data fetching for oversikt: (se sikkerLogg for detaljer)`);
            logger.sikker.error(`[${speilUser(req)}] Error during data fetching for oversikt: ${JSON.stringify(err)}`, {
                error: err,
                request: logger.requestMeta(req),
            });
            res.sendStatus(err.status || 503);
        });
};

const auditLog = (req: SpeilRequest, ...params: string[]) => {
    logger.sikker.info(`${speilUser(req)} is doing lookup with params: ${params.join(', ')}`, logger.requestMeta(req));
};

const speilUser = (req: SpeilRequest) => authSupport.valueFromClaim('name', req.session.speilToken);

const auditLogOversikt = (req: SpeilRequest) => {
    logger.sikker.info(`${speilUser(req)} is viewing front page`, logger.requestMeta(req));
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
