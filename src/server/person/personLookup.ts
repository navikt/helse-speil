import authSupport from '../auth/authSupport';
import logger from '../logging';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import { SpesialistClient } from './spesialistClient';
import { AppConfig, OnBehalfOf } from '../types';
import { Request, Response } from 'express';
import { Storage } from '../tildeling/storage';
import { Oppgave, Speiltildeling, SpesialistOppgave } from '../../types';

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

    return onBehalfOf
        .hentFor(spesialistId, req.session!.speilToken)
        .then((token: string) => lookupPromise(undeterminedId, token))
        .then(async (apiResponse: any) => {
            res.status(apiResponse.status).send({
                person: {
                    ...apiResponse.body,
                    tildeltTil: apiResponse.body.saksbehandlerepost ?? (await finnTildeling(apiResponse)),
                },
            });
        })
        .catch((err) => {
            logger.error(`[${speilUser(req)}] Error during data fetching for finnPerson: ${err}`);
            res.sendStatus(503);
        });
};

const oppgaverForPeriode = (req: Request, res: Response) => {
    auditLogOversikt(req);

    const tildeltTil = (oppgave: SpesialistOppgave, speiltildelinger: Speiltildeling[]): string | undefined =>
        oppgave.saksbehandlerepost ??
        speiltildelinger.find((tildeling) => tildeling.oppgavereferanse === oppgave.oppgavereferanse)?.userId;

    const oppgaverMedTildelinger = async (response: Body): Promise<Oppgave[]> => {
        const body: any = response.body;
        const oppgavereferanser = body.map((oppgave: SpesialistOppgave) => oppgave.oppgavereferanse);
        const tildelinger = await storage.getAll(oppgavereferanser);
        return body.map(
            (oppgave: SpesialistOppgave): Oppgave => ({
                oppgavereferanse: oppgave.oppgavereferanse,
                tildeltTil: tildeltTil(oppgave, tildelinger),
                opprettet: oppgave.opprettet,
                vedtaksperiodeId: oppgave.vedtaksperiodeId,
                personinfo: oppgave.personinfo,
                fødselsnummer: oppgave.fødselsnummer,
                aktørId: oppgave.aktørId,
                antallVarsler: oppgave.antallVarsler,
                type: oppgave.type,
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
            logger.error(`[${speilUser(req)}] Error during data fetching for oversikt: ${err}`);
            res.sendStatus(503);
        });
};

const auditLog = (req: Request, ...params: string[]) => {
    logger.audit(`${speilUser(req)} is doing lookup with params: ${params.join(', ')}`);
};

const speilUser = (req: Request) => authSupport.valueFromClaim('name', req.session!.speilToken);

const auditLogOversikt = (req: Request) => {
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
