import spesialistSchema from '../graphql.schema.json';
import { Express } from 'express';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import path from 'path';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';

import { antallTilfeldigeOppgaver } from '../devHelpers';
import { behandledeOppgaver } from './data/behandledeOppgaver';
import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { getMockOppdrag } from './data/oppdrag';
import { oppgaver, tilfeldigeOppgaver } from './data/oppgaver';
import { FlereFodselsnumreError, NotFoundError } from './errors';
import { hentOpptegnelser, opprettAbonnement } from './opptegnelser';
import type {
    BeregnetPeriode,
    FiltreringInput,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    MutationFjernPaaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaaVentArgs,
    MutationLeggTilKommentarArgs,
    MutationLeggTilNotatArgs,
    MutationOpprettTildelingArgs,
    MutationOverstyrArbeidsforholdArgs,
    MutationOverstyrDagerArgs,
    MutationOverstyrInntektOgRefusjonArgs,
    MutationSendIReturArgs,
    MutationSendTilGodkjenningArgs,
    MutationSettVarselstatusArgs,
    MutationSkjonnsfastsettSykepengegrunnlagArgs,
    OppgaveTilBehandling,
    OppgaverTilBehandling,
    OppgavesorteringInput,
    Person,
} from './schemaTypes';
import { NotatType } from './schemaTypes';
import { DokumentMock } from './storage/dokument';
import { NotatMock } from './storage/notat';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';
import { TildelingMock } from './storage/tildeling';
import { VarselMock } from './storage/varsel';

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const generasjon of arbeidsgiver.generasjoner) {
            for (const periode of generasjon.perioder as Array<BeregnetPeriode>) {
                if (periode.oppgave?.id && TildelingMock.harTildeling(periode.oppgave.id)) {
                    tildeling = TildelingMock.getTildeling(periode.oppgave.id);
                }

                periode.notater = NotatMock.getNotaterForPeriode(periode);
                periode.varsler = VarselMock.getVarslerForPeriode(periode.varsler);
                const oppgavereferanse: string | null = periode.oppgavereferanse ?? periode.oppgave?.id ?? null;
                const oppgave: Oppgave | null = oppgavereferanse ? OppgaveMock.getOppgave(oppgavereferanse) : null;

                if (oppgave !== null && periode.oppgave === null) {
                    periode.oppgave = { id: oppgave.id };
                }
            }
        }
    }

    person.tildeling = tildeling;
};

const fetchPersondata = (): Record<string, JSON> => {
    const url = path.join(__dirname, '/data/personer');
    const filenames = fs.readdirSync(url);

    const files = filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw);
    });

    return files.reduce((data, { data: { person } }) => {
        leggTilLagretData(person);
        data[person.aktorId] = person;
        data[person.fodselsnummer] = person;
        return data;
    }, {});
};

let valgtPerson: Person | undefined = undefined;

const getResolvers = (): IResolvers => ({
    Query: {
        person: async (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            if (aktorId == '1337') {
                throw new FlereFodselsnumreError();
            }
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) {
                throw new NotFoundError(fnr ?? aktorId ?? '');
            }
            valgtPerson = person as unknown as Person;
            return person;
        },
        oppdrag: (_) => {
            return getMockOppdrag();
        },
        behandledeOppgaverIDag: async () => {
            return behandledeOppgaver;
        },
        behandlingsstatistikk: async () => {
            return behandlingsstatistikk;
        },
        oppgaveFeed: async (
            _,
            {
                filtrering,
            }: { offset: string; limit: string; sortering: OppgavesorteringInput; filtrering: FiltreringInput },
        ) => {
            const oppgaveliste = oppgaver
                .map((oppgave) => {
                    if (
                        oppgave.tildeling !== undefined &&
                        oppgave.tildeling !== null &&
                        !TildelingMock.harTildeling(oppgave.id)
                    ) {
                        TildelingMock.setTildeling(oppgave.id, oppgave.tildeling);
                    }
                    return {
                        ...oppgave,
                        tildeling: TildelingMock.getTildeling(oppgave.id),
                    } as OppgaveTilBehandling;
                })
                .concat(tilfeldigeOppgaver(antallTilfeldigeOppgaver));
            if (filtrering.egneSaker) {
                const mineSaker = oppgaveliste.filter(
                    (oppgave) =>
                        oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' &&
                        !oppgave.tildeling?.paaVent,
                );
                return {
                    oppgaver: mineSaker,
                    totaltAntallOppgaver: mineSaker.length,
                } as OppgaverTilBehandling;
            }
            if (filtrering.egneSakerPaVent) {
                const mineSakerPåVent = oppgaveliste.filter(
                    (oppgave) =>
                        oppgave.tildeling?.oid === '4577332e-801a-4c13-8a71-39f12b8abfa3' && oppgave.tildeling?.paaVent,
                );
                return {
                    oppgaver: mineSakerPåVent,
                    totaltAntallOppgaver: mineSakerPåVent.length,
                } as OppgaverTilBehandling;
            }
            return { oppgaver: oppgaveliste, totaltAntallOppgaver: oppgaveliste.length } as OppgaverTilBehandling;
        },
        antallOppgaver: async () => {
            const tildelinger = TildelingMock.getTildelingerFor('4577332e-801a-4c13-8a71-39f12b8abfa3');
            return {
                antallMineSaker: tildelinger.filter((tildeling) => !tildeling.paaVent).length,
                antallMineSakerPaVent: tildelinger.filter((tildeling) => tildeling.paaVent).length,
            };
        },
        notater: async (_, { forPerioder }: { forPerioder: string[] }) => {
            return forPerioder.map((it) => ({
                id: it,
                notater: NotatMock.getNotater(it),
            }));
        },
        hentSoknad: async (_) => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve('test');
                }, 3000);
            });
            return DokumentMock.getMockedSoknad();
        },
        hentInntektsmelding: async (_) => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve('test');
                }, 1000);
            });
            return DokumentMock.getMockedInntektsmelding();
        },
        opptegnelser: async (_, { sekvensId }) => {
            return hentOpptegnelser(sekvensId);
        },
    },
    Mutation: {
        leggTilNotat: (_, { type, vedtaksperiodeId, tekst }: MutationLeggTilNotatArgs) => {
            return NotatMock.addNotat(vedtaksperiodeId, { tekst: tekst, type: type });
        },
        feilregistrerNotat: (_, { id }: MutationFeilregistrerNotatArgs) => {
            NotatMock.feilregistrerNotat({ id });
            return NotatMock.getNotat(id);
        },
        feilregistrerKommentar: (_, { id }: MutationFeilregistrerKommentarArgs) => {
            NotatMock.feilregistrerKommentar({ id });
            return NotatMock.getKommentar(id);
        },
        leggTilKommentar: (_, { tekst, notatId, saksbehandlerident }: MutationLeggTilKommentarArgs) => {
            return NotatMock.addKommentar({ tekst, notatId, saksbehandlerident });
        },
        settVarselstatus: async (
            _,
            { generasjonIdString, definisjonIdString, varselkode, ident }: MutationSettVarselstatusArgs,
        ) => {
            if (definisjonIdString) {
                return VarselMock.settVarselstatusVurdert(
                    {
                        generasjonIdString,
                        definisjonIdString,
                        varselkode,
                        ident,
                    },
                    valgtPerson,
                );
            } else {
                return VarselMock.settVarselstatusAktiv({ generasjonIdString, varselkode, ident });
            }
        },
        opprettTildeling: async (_, { oppgaveId }: MutationOpprettTildelingArgs) => {
            if (TildelingMock.harTildeling(oppgaveId)) {
                return new GraphQLError('Oppgave allerede tildelt', {
                    extensions: {
                        code: { value: 409 },
                        tildeling: TildelingMock.getTildeling(oppgaveId),
                    },
                });
            }
            if (Math.random() > 0.95) {
                return new GraphQLError(`Kunne ikke tildele oppgave med oppgaveId=${oppgaveId}`, {
                    extensions: { code: { value: 500 } },
                });
            }
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
                paaVent: OppgaveMock.getOppgave(oppgaveId)?.erPåVent ?? false,
            });

            return TildelingMock.getTildeling(oppgaveId);
        },
        fjernTildeling: (_, { oppgaveId }: MutationFjernTildelingArgs) => {
            if (TildelingMock.harTildeling(oppgaveId)) {
                TildelingMock.fjernTildeling(oppgaveId);
                return true;
            } else {
                return false;
            }
        },
        leggPaaVent: async (_, { oppgaveId, notatType, notatTekst }: MutationLeggPaaVentArgs) => {
            NotatMock.addNotat(oppgaveId, { tekst: notatTekst, type: notatType });
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
                paaVent: true,
            });
            return TildelingMock.getTildeling(oppgaveId);
        },
        innvilgVedtak: async () => {
            return (
                Math.random() < 0.95 ||
                new GraphQLError(`Oppgaven er ikke åpen.`, {
                    extensions: { code: { value: 500 } },
                })
            );
        },
        sendTilInfotrygd: async () => {
            return (
                Math.random() < 0.95 ??
                new GraphQLError(`Allerede sendt til Infotrygd`, {
                    extensions: { code: { value: 409 } },
                })
            );
        },
        fjernPaaVent: async (_, { oppgaveId }: MutationFjernPaaVentArgs) => {
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
                paaVent: false,
            });
            return TildelingMock.getTildeling(oppgaveId);
        },
        overstyrDager: async (_, __: MutationOverstyrDagerArgs) => {
            return true;
        },
        overstyrInntektOgRefusjon: async (_, __: MutationOverstyrInntektOgRefusjonArgs) => {
            return true;
        },
        overstyrArbeidsforhold: async (_, __: MutationOverstyrArbeidsforholdArgs) => {
            return true;
        },
        skjonnsfastsettSykepengegrunnlag: async (_, __: MutationSkjonnsfastsettSykepengegrunnlagArgs) => {
            return true;
        },
        sendTilGodkjenning: async (_, { oppgavereferanse }: MutationSendTilGodkjenningArgs) => {
            const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
            const oppgave: Oppgave = {
                ...getDefaultOppgave(),
                id: oppgavereferanse,
                tildelt:
                    tidligereSaksbehandler === '4577332e-801a-4c13-8a71-39f12b8abfa3'
                        ? null
                        : '4577332e-801a-4c13-8a71-39f12b8abfa3',
                totrinnsvurdering: {
                    erRetur: false,
                    erBeslutteroppgave: true,
                    saksbehandler: '4577332e-801a-4c13-8a71-39f12b8abfa3',
                },
            };

            OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);
            return true;
        },
        sendIRetur: async (_, { oppgavereferanse, notatTekst }: MutationSendIReturArgs) => {
            const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
            const oppgave: Oppgave = {
                ...getDefaultOppgave(),
                id: oppgavereferanse,
                tildelt: tidligereSaksbehandler,
                totrinnsvurdering: {
                    saksbehandler: '4577332e-801a-4c13-8a71-39f12b8abfa3',
                    erRetur: true,
                    erBeslutteroppgave: false,
                },
            };

            OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);

            NotatMock.addNotat(oppgavereferanse, {
                vedtaksperiodeId: oppgavereferanse,
                tekst: notatTekst,
                type: NotatType.Retur,
            });
            return true;
        },
        annuller: async (_, __) => {
            return true;
        },
        oppdaterPerson: async (_, __) => {
            return true;
        },
        opprettAbonnement: async (_) => {
            return opprettAbonnement();
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string; vilkarsgrunnlagId: string }) => {
            return periode.beregningId
                ? 'BeregnetPeriode'
                : periode?.vilkarsgrunnlagId
                ? 'UberegnetVilkarsprovdPeriode'
                : 'UberegnetPeriode';
        },
    },
    Vilkarsgrunnlag: {
        __resolveType: (grunnlag: { grunnbelop?: number }) => {
            return typeof grunnlag.grunnbelop === 'number' ? 'VilkarsgrunnlagSpleis' : 'VilkarsgrunnlagInfotrygd';
        },
    },
    Hendelse: {
        __resolveType: (hendelse: { type: string }) => {
            return (() => {
                switch (hendelse.type) {
                    case 'INNTEKTSMELDING':
                        return 'Inntektsmelding';
                    case 'NY_SOKNAD':
                        return 'Sykmelding';
                    case 'SENDT_SOKNAD_ARBEIDSGIVER':
                        return 'SoknadArbeidsgiver';
                    case 'SENDT_SOKNAD_NAV':
                        return 'SoknadNav';
                    default:
                        throw Error(`Fant hendelse med ukjent type: ${hendelse.type}`);
                }
            })();
        },
    },
    Overstyring: {
        __resolveType: (overstyring: { dager?: Array<object>; inntekt?: object; skjonnsfastsatt?: object }) =>
            overstyring.dager
                ? 'Dagoverstyring'
                : overstyring.inntekt
                ? 'Inntektoverstyring'
                : overstyring.skjonnsfastsatt
                ? 'Sykepengegrunnlagskjonnsfastsetting'
                : 'Arbeidsforholdoverstyring',
    },
});

const buildSchema = (): GraphQLSchema => {
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};

export const setUpGraphQLMiddleware = (app: Express) => {
    const schema = buildSchema();
    const yoga = createYoga({
        schema,
        graphiql: true,
    });
    app.use('/graphql', yoga);
};
