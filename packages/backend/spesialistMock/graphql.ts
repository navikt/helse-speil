import fs from 'fs';
import path from 'path';

import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildClientSchema, GraphQLSchema, IntrospectionQuery } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';

import spesialistSchema from '../graphql.schema.json';
import { NotFoundError } from './errors';
import {
    oppgaverPåVent,
    oppgaverTilBeslutter,
    oppgaverTilRetur,
    oppgaveTildelinger,
    tidligereSaksbehandlerForOppgave,
    vedtaksperiodenotater,
} from './server';

const erTildelt = (periode: any) =>
    periode.oppgavereferanse && oppgaveTildelinger[periode.oppgavereferanse] !== undefined;

const erPåVent = (periode: any) =>
    periode.oppgavereferanse &&
    oppgaverPåVent[periode.oppgavereferanse] !== undefined &&
    oppgaverPåVent[periode.oppgavereferanse];

const erBeslutterOppgave = (periode: any) =>
    periode.oppgavereferanse && oppgaverTilBeslutter[periode.oppgavereferanse] !== undefined
        ? oppgaverTilBeslutter[periode.oppgavereferanse]
        : periode.erBeslutterOppgave;

const erReturOppgave = (periode: any) =>
    periode.oppgavereferanse && oppgaverTilRetur[periode.oppgavereferanse] !== undefined
        ? oppgaverTilRetur[periode.oppgavereferanse]
        : periode.erReturOppgave;

const getTidligereSaksbehandlerOid = (periode: any) =>
    periode.oppgavereferanse && tidligereSaksbehandlerForOppgave[periode.oppgavereferanse] !== undefined
        ? tidligereSaksbehandlerForOppgave[periode.oppgavereferanse]
        : periode.tidligereSaksbehandlerOid;

const getTildeltTildeling = (periode: any) => {
    return {
        epost: 'epost@nav.no',
        navn: 'Utvikler, Lokal',
        oid: 'uuid',
        reservert: erPåVent(periode) ?? false,
    };
};

const getNotater = (periode: any) => {
    const notaterFraFil = [...(periode.notater || [])];
    const notaterPåVedtaksperiodeId =
        periode.vedtaksperiodeId && vedtaksperiodenotater[periode.vedtaksperiodeId] !== undefined
            ? vedtaksperiodenotater[periode.vedtaksperiodeId]
            : [];
    // Dette er kun for mockens skyld. I noen av kallene hvor vi oppretter notater har vi ikke vedtaksperiodeId, så da lagrer vi på oppgavereferanse.
    const notaterPåOppgavereferanse =
        periode.oppgavereferanse && vedtaksperiodenotater[periode.oppgavereferanse] !== undefined
            ? vedtaksperiodenotater[periode.oppgavereferanse]
            : [];

    return [...notaterFraFil, ...notaterPåVedtaksperiodeId, ...notaterPåOppgavereferanse];
};

const leggTilLagretData = (person: any) => {
    let tildeling = person.tildeling;

    const modifisertPerson = {
        ...person,
        arbeidsgivere: person.arbeidsgivere.map((arbeidsgiver: any) => ({
            ...arbeidsgiver,
            generasjoner: arbeidsgiver.generasjoner.map((generasjon: any) => ({
                ...generasjon,
                perioder: generasjon.perioder.map((periode: any) => {
                    if (erTildelt(periode)) tildeling = getTildeltTildeling(periode);
                    return {
                        ...periode,
                        notater: getNotater(periode),
                        erBeslutterOppgave: erBeslutterOppgave(periode),
                        erReturOppgave: erReturOppgave(periode),
                        tidligereSaksbehandlerOid: getTidligereSaksbehandlerOid(periode),
                    };
                }),
            })),
        })),
    };

    return {
        ...modifisertPerson,
        tildeling,
    };
};

const fetchPersondata = (): Record<string, JSON> => {
    const url = path.join(__dirname, '/data');
    const filenames = fs.readdirSync(url);
    const files = filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw);
    });
    return files.reduce((data, file) => {
        const person = leggTilLagretData(file.data.person);
        return {
            ...data,
            [person.aktorId]: person,
            [person.fodselsnummer]: person,
        };
    }, {});
};

const oppdrag = [
    {
        type: 'UTBETALING',
        status: 'UTBETALT',
        arbeidsgiveroppdrag: {
            fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
            linjer: [],
            organisasjonsnummer: '839942907',
        },
        personoppdrag: {
            fodselsnummer: '20087106951',
            fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
            linjer: [
                {
                    fom: '2021-12-17',
                    tom: '2021-12-31',
                    totalbelop: 15235,
                },
            ],
        },
        annullering: null,
        totalbelop: 15235,
    },
    {
        type: 'REVURDERING',
        status: 'UTBETALT',
        arbeidsgiveroppdrag: {
            fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
            linjer: [],
            organisasjonsnummer: '839942907',
        },
        personoppdrag: {
            fodselsnummer: '20087106951',
            fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
            linjer: [
                {
                    fom: '2021-12-17',
                    tom: '2021-12-27',
                    totalbelop: 9695,
                },
                {
                    fom: '2021-12-28',
                    tom: '2021-12-30',
                    totalbelop: 3324,
                },
                {
                    fom: '2021-12-31',
                    tom: '2021-12-31',
                    totalbelop: 1385,
                },
            ],
        },
        annullering: null,
        totalbelop: 14404,
    },
    {
        type: 'UTBETALING',
        status: 'UTBETALT',
        arbeidsgiveroppdrag: {
            fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
            linjer: [],
            organisasjonsnummer: '839942907',
        },
        personoppdrag: {
            fodselsnummer: '20087106951',
            fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
            linjer: [
                {
                    fom: '2021-12-17',
                    tom: '2021-12-27',
                    totalbelop: 9695,
                },
                {
                    fom: '2021-12-28',
                    tom: '2021-12-30',
                    totalbelop: 3324,
                },
                {
                    fom: '2021-12-31',
                    tom: '2022-01-05',
                    totalbelop: 5540,
                },
                {
                    fom: '2022-01-10',
                    tom: '2022-01-10',
                    totalbelop: 1108,
                },
                {
                    fom: '2022-01-11',
                    tom: '2022-01-14',
                    totalbelop: 5540,
                },
            ],
        },
        annullering: null,
        totalbelop: 25207,
    },
];

const getResolvers = (): IResolvers => ({
    Query: {
        person: (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) {
                throw new NotFoundError(`Finner ikke data for person med fødselsnummer ${fnr ?? aktorId}`, 'person');
            }
            return person;
        },
        oppdrag: (_, { fnr }: { fnr: string }) => {
            return getMockOppdrag();
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
        __resolveType: (overstyring: { dager?: Array<object>; inntekt?: object }) => {
            return overstyring.dager
                ? 'Dagoverstyring'
                : overstyring.inntekt
                ? 'Inntektoverstyring'
                : 'Arbeidsforholdoverstyring';
        },
    },
});

const buildSchema = (): GraphQLSchema => {
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};

export const setupGraphQLMiddleware = (app: Express) => {
    const schema = buildSchema();
    app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
};
