import { Express } from 'express';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import path from 'path';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';

import { antallTilfeldigeOppgaver } from '../devHelpers';
import spesialistSchema from '../graphql.schema.json';
import { behandledeOppgaver } from './data/behandledeOppgaver';
import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { getMockOppdrag } from './data/oppdrag';
import { oppgaver, tilfeldigeOppgaver } from './data/oppgaver';
import { FlereFodselsnumreError, NotFoundError } from './errors';
import type {
    BeregnetPeriode,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    MutationFjernPaaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaaVentArgs,
    MutationLeggTilKommentarArgs,
    MutationLeggTilNotatArgs,
    MutationOpprettTildelingArgs,
    MutationSettVarselstatusAktivArgs,
    MutationSettVarselstatusVurdertArgs,
    OppgaveForOversiktsvisning,
    Person,
} from './schemaTypes';
import { NotatMock } from './storage/notat';
import { OppgaveMock } from './storage/oppgave';
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

                if (typeof oppgave === 'object' && periode.oppgave === null) {
                    periode.oppgave = oppgave;
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
            return person;
        },
        oppdrag: (_) => {
            return getMockOppdrag();
        },
        behandledeOppgaver: async () => {
            return behandledeOppgaver;
        },
        behandlingsstatistikk: async () => {
            return behandlingsstatistikk;
        },
        alleOppgaver: async () => {
            return oppgaver
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
                    } as OppgaveForOversiktsvisning;
                })
                .concat(tilfeldigeOppgaver(antallTilfeldigeOppgaver));
        },
        notater: async (_, { forPerioder }: { forPerioder: string[] }) => {
            return forPerioder.map((it) => ({
                id: it,
                notater: NotatMock.getNotater(it),
            }));
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
        settVarselstatusVurdert: async (
            _,
            { generasjonIdString, definisjonIdString, varselkode, ident }: MutationSettVarselstatusVurdertArgs,
        ) => {
            return VarselMock.settVarselstatusVurdert({
                generasjonIdString,
                definisjonIdString,
                varselkode,
                ident,
            });
        },
        settVarselstatusAktiv: async (
            _,
            { generasjonIdString, varselkode, ident }: MutationSettVarselstatusAktivArgs,
        ) => {
            return VarselMock.settVarselstatusAktiv({ generasjonIdString, varselkode, ident });
        },
        opprettTildeling: async (_, { oppgaveId }: MutationOpprettTildelingArgs) => {
            if (TildelingMock.harTildeling(oppgaveId)) {
                return new GraphQLError('Oppgave allerede tildelt', null, null, null, null, null, {
                    code: { value: 409 },
                    tildeling: TildelingMock.getTildeling(oppgaveId),
                });
            }
            if (Math.random() > 0.95) {
                return new GraphQLError(
                    `Kunne ikke tildele oppgave med oppgaveId=${oppgaveId}`,
                    null,
                    null,
                    null,
                    null,
                    null,
                    {
                        code: { value: 500 },
                    },
                );
            }
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: 'uuid',
                reservert: OppgaveMock.getOppgave(oppgaveId)?.erPåVent ?? false,
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
                oid: 'uuid',
                reservert: true,
                paaVent: true,
            });
            return TildelingMock.getTildeling(oppgaveId);
        },
        fjernPaaVent: async (_, { oppgaveId }: MutationFjernPaaVentArgs) => {
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: 'uuid',
                reservert: false,
                paaVent: false,
            });
            return TildelingMock.getTildeling(oppgaveId);
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string }) => {
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
