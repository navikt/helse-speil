import fs from 'fs';
import path from 'path';

import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildClientSchema, GraphQLSchema, IntrospectionQuery } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';

import spesialistSchema from '../graphql.schema.json';

const fetchPersondata = (): Record<string, JSON> => {
    const url = path.join(__dirname, '/data');
    const filenames = fs.readdirSync(url);
    const files = filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw);
    });
    return files.reduce((data, file) => {
        const person = file.data.person;
        return {
            ...data,
            [person.aktorId]: person,
            [person.fodselsnummer]: person,
        };
    }, {});
};

const persondata = fetchPersondata();

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
            return persondata[fnr ?? aktorId ?? ''];
        },
        oppdrag: (_, { fnr }: { fnr: string }) => {
            return oppdrag;
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string }) => {
            return periode.beregningId ? 'BeregnetPeriode' : 'UberegnetPeriode';
        },
    },
    Vilkarsgrunnlag: {
        __resolveType: (grunnlag: { grunnbelop?: number }) => {
            return grunnlag.grunnbelop !== null ? 'VilkarsgrunnlagSpleis' : 'VilkarsgrunnlagInfotrygd';
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
        __resolveType: (overstyring: { dager?: Array<object> }) => {
            return overstyring.dager ? 'Dagoverstyring' : 'Inntektoverstyring';
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
