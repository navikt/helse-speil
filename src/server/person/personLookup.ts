import authSupport from '../auth/authSupport';
import logger from '../logging';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import { SpesialistClient } from './spesialistClient';
import { AppConfig, OnBehalfOf, SpeilRequest } from '../types';
import { Response } from 'express';
import { Oppgave, Oppgavetype, Periodetype, SpesialistOppgave } from '../../types';

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
                    tildeltTil: apiResponse.body.saksbehandlerepost,
                },
            });
        })
        .catch((err) => {
            logger.error(`[${speilUser(req)}] Error during data fetching for finnPerson: ${JSON.stringify(err)}`);
            res.sendStatus(err.status || 503);
        });
};

const oppgaverForPeriode = (req: SpeilRequest, res: Response) => {
    auditLogOversikt(req);

    const oppgaverMedTildelinger = async (response: Body): Promise<Oppgave[]> => {
        const body: any = response.body;
        return body.map(
            (oppgave: SpesialistOppgave): Oppgave => ({
                oppgavereferanse: oppgave.oppgavereferanse,
                tildeltTil: oppgave.saksbehandlerepost ?? undefined,
                opprettet: oppgave.opprettet,
                vedtaksperiodeId: oppgave.vedtaksperiodeId,
                personinfo: oppgave.personinfo,
                fødselsnummer: oppgave.fødselsnummer,
                aktørId: oppgave.aktørId,
                antallVarsler: oppgave.antallVarsler,
                periodetype: oppgave.oppgavetype == Oppgavetype.Stikkprøve ? Periodetype.Stikkprøve : oppgave.type,
                boenhet: oppgave.boenhet,
            })
        );
    };

    onBehalfOf
        .hentFor(spesialistId, req.session!.speilToken)
        .then((behalfOfToken) => spesialistClient.behandlingerForPeriode(behalfOfToken))
        .then(async (apiResponse) => {
            res.status(apiResponse.status).send({
                oppgaver: await oppgaverMedTildelinger(apiResponse),
            });
        })
        .catch((err) => {
            logger.error(`[${speilUser(req)}] Error during data fetching for oversikt: ${JSON.stringify(err)}`);
            res.sendStatus(err.status || 503);
        });
};

const auditLog = (req: SpeilRequest, ...params: string[]) => {
    logger.audit(`${speilUser(req)} is doing lookup with params: ${params.join(', ')}`);
};

export const speilUser = (req: SpeilRequest) => authSupport.valueFromClaim('name', req.session.speilToken);

const auditLogOversikt = (req: SpeilRequest) => {
    logger.audit(`${speilUser(req)} is viewing front page`);
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
