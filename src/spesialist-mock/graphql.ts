import spesialistSchema from './graphql.schema.json';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';
import * as R from 'remeda';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';

import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { behandledeOppgaverliste, oppgaveliste } from './data/oppgaveoversikt';
import { FlereFodselsnumreError, ManglendeAvviksvurderingError, NotFoundError } from './errors';
import { hentOpptegnelser, opprettAbonnement } from './opptegnelser';
import {
    BeregnetPeriode,
    FiltreringInput,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    MutationFjernPaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaVentArgs,
    MutationLeggTilKommentarArgs,
    MutationLeggTilNotatArgs,
    MutationOpphevStansArgs,
    MutationOpprettTildelingArgs,
    MutationSendIReturArgs,
    MutationSendTilGodkjenningArgs,
    MutationSettVarselstatusArgs,
    NotatType,
    OppgavesorteringInput,
    Person,
} from './schemaTypes';
import { DokumentMock } from './storage/dokument';
import { NotatMock } from './storage/notat';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';
import { OpphevStansMock } from './storage/opphevstans';
import { PaVentMock } from './storage/påvent';
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

                if (periode.oppgave?.id && PaVentMock.erPåVent(periode.oppgave.id)) {
                    periode.paVent = PaVentMock.getPåVent(periode.oppgave.id);
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

    const lagretUnntattFraAutomatiskGodkjenning = OpphevStansMock.getUnntattFraAutomatiskGodkjenning(
        person.fodselsnummer,
    );

    if (lagretUnntattFraAutomatiskGodkjenning)
        person.personinfo.unntattFraAutomatisering = lagretUnntattFraAutomatiskGodkjenning;

    person.tildeling = tildeling;
};

const fetchPersondata = (): Record<string, Person> => {
    const url = path.join(cwd(), 'src/spesialist-mock/data/personer');
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

let valgtPerson: Person | undefined;

const getResolvers = (): IResolvers => ({
    Query: {
        person: async (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            if (aktorId == '1337') return new FlereFodselsnumreError();
            if (aktorId == '9001') return new ManglendeAvviksvurderingError();
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) return new NotFoundError(fnr ?? aktorId ?? '');
            valgtPerson = person;
            return person;
        },
        behandledeOppgaverFeed: async (_, { offset, limit }: { offset: number; limit: number }) => {
            return behandledeOppgaverliste(offset, limit);
        },
        behandlingsstatistikk: async () => {
            return behandlingsstatistikk;
        },
        oppgaveFeed: async (
            _,
            {
                offset,
                limit,
                sortering,
                filtrering,
            }: { offset: number; limit: number; sortering: OppgavesorteringInput[]; filtrering: FiltreringInput },
        ) => {
            return oppgaveliste(offset, limit, sortering, filtrering);
        },
        antallOppgaver: async () => {
            const tildelinger = TildelingMock.getTildelingerFor('4577332e-801a-4c13-8a71-39f12b8abfa3');
            const paVent = PaVentMock.getPåVentFor('4577332e-801a-4c13-8a71-39f12b8abfa3');
            return {
                antallMineSaker: tildelinger.length,
                antallMineSakerPaVent: paVent.length,
            };
        },
        notater: async (_, { forPerioder }: { forPerioder: string[] }) => {
            return forPerioder.map((it) => ({
                id: it,
                notater: NotatMock.getNotater(it),
            }));
        },
        hentSoknad: async () => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve('test');
                }, 3000);
            });
            return DokumentMock.getMockedSoknad();
        },
        hentInntektsmelding: async () => {
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
        leggPaVent: async (_, { oppgaveId, notatType, notatTekst }: MutationLeggPaVentArgs) => {
            NotatMock.addNotat(oppgaveId, { tekst: notatTekst, type: notatType });
            PaVentMock.setPåVent(oppgaveId, {
                frist: '2024-01-01',
                begrunnelse: 'En begrunnelse',
                oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
            });
            return PaVentMock.getPåVent(oppgaveId);
        },
        fjernPaVent: async (_, { oppgaveId }: MutationFjernPaVentArgs) => {
            PaVentMock.fjernPåVent(oppgaveId);
            return true;
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
        overstyrDager: async () => {
            return true;
        },
        overstyrInntektOgRefusjon: async () => {
            return true;
        },
        overstyrArbeidsforhold: async () => {
            return true;
        },
        skjonnsfastsettSykepengegrunnlag: async () => {
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
        annuller: async () => {
            return true;
        },
        oppdaterPerson: async () => {
            return true;
        },
        opprettAbonnement: async () => {
            return opprettAbonnement();
        },
        opphevStans: async (_, { fodselsnummer, begrunnelse }: MutationOpphevStansArgs) => {
            const oppgaveId = finnOppgaveId();
            if (oppgaveId) NotatMock.addNotat(oppgaveId, { tekst: begrunnelse, type: NotatType.OpphevStans });
            OpphevStansMock.addUnntattFraAutomatiskGodkjenning(fodselsnummer, { erUnntatt: false });
            return true;
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string; vilkarsgrunnlagId: string }) => {
            return periode.beregningId ? 'BeregnetPeriode' : 'UberegnetPeriode';
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
                    case 'SENDT_SOKNAD_ARBEIDSLEDIG':
                        return 'SoknadArbeidsledig';
                    case 'SENDT_SOKNAD_FRILANS':
                        return 'SoknadFrilans';
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

const finnOppgaveId = () => {
    if (!valgtPerson) return;
    for (const arbeidsgiver of valgtPerson.arbeidsgivere) {
        for (const generasjon of arbeidsgiver.generasjoner) {
            for (const periode of generasjon.perioder as Array<BeregnetPeriode>) {
                if (periode.oppgave) return periode.oppgave.id;
            }
        }
    }
    return undefined;
};

export const buildSchema = (): GraphQLSchema => {
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};
