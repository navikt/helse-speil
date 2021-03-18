import authSupport from '../auth/authSupport';
import logger from '../logging';
import { erGyldigFødselsnummer } from '../aktørid/fødselsnummerValidation';
import { SpesialistClient } from './spesialistClient';
import { AppConfig, OnBehalfOf, SpeilRequest } from '../types';
import { Response } from 'express';
import { Inntektskilde, Oppgavetype, SpesialistOppgave, Periodetype as SpesialistPeriodetype} from '../../types';
import {Kjønn, Oppgave, Periodetype} from "internal-types";
import dayjs from "dayjs";

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
                    tildeltTil: apiResponse.body.saksbehandlerepost,
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

    const kjønn = (kjønn: string | null): Kjønn => {
        if (!kjønn) return 'ukjent'
        switch (kjønn.toLowerCase()) {
            case 'mann': return 'mann'
            case 'kvinne': return 'kvinne'
            default: return 'ukjent'
        }
    }

    const oppgaverMedTildelinger = async (response: Body): Promise<Oppgave[]> => {
        const body: any = response.body;
        const periodeType = (type: SpesialistPeriodetype) => {
            switch(type) {
                case SpesialistPeriodetype.Forlengelse:
                    return Periodetype.Forlengelse
                case SpesialistPeriodetype.Førstegangsbehandling:
                    return Periodetype.Førstegangsbehandling
                case SpesialistPeriodetype.Infotrygdforlengelse:
                    return Periodetype.Infotrygdforlengelse
                case SpesialistPeriodetype.OvergangFraInfotrygd:
                    return Periodetype.OvergangFraInfotrygd
                case SpesialistPeriodetype.Stikkprøve:
                    return Periodetype.Stikkprøve
                case SpesialistPeriodetype.RiskQa:
                    return Periodetype.RiskQa
            }
        }
        return body.map(
            (oppgave: SpesialistOppgave): Oppgave => ({
                oppgavereferanse: oppgave.oppgavereferanse,
                tildeltTil: oppgave.saksbehandlerepost ?? undefined,
                erPåVent: oppgave.erPåVent ?? undefined,
                opprettet: oppgave.opprettet,
                vedtaksperiodeId: oppgave.vedtaksperiodeId,
                personinfo: {
                    fornavn: oppgave.personinfo.fornavn,
                    mellomnavn: oppgave.personinfo.mellomnavn,
                    etternavn: oppgave.personinfo.etternavn,
                    kjønn: kjønn(oppgave.personinfo.kjønn),
                    fødselsdato: oppgave.personinfo.fødselsdato ? dayjs(oppgave.personinfo.fødselsdato) : null,
                    fnr: undefined
                },
                fødselsnummer: oppgave.fødselsnummer,
                aktørId: oppgave.aktørId,
                antallVarsler: oppgave.antallVarsler,
                periodetype:
                    oppgave.oppgavetype === Oppgavetype.Stikkprøve
                        ? Periodetype.Stikkprøve
                        : oppgave.oppgavetype === Oppgavetype.RiskQa
                        ? Periodetype.RiskQa
                        : periodeType(oppgave.type),
                boenhet: oppgave.boenhet,
                inntektskilde: oppgave.inntektskilde ?? Inntektskilde.EnArbeidsgiver,
                tildeling: oppgave.tildeling ? {
                    epost: oppgave.tildeling.epost,
                    oid: oppgave.tildeling.oid,
                    påVent: oppgave.tildeling.påVent,
                } : undefined
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
