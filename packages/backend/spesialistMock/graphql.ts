import fs from 'fs';
import path from 'path';

import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildClientSchema, GraphQLSchema, IntrospectionQuery } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers } from '@graphql-tools/utils';

import spesialistSchema from '../graphql.schema.json';

const fetchData = (): Record<string, JSON> => {
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
        };
    }, {});
};

const data = fetchData();

const getResolvers = (): IResolvers => ({
    Query: {
        person: (_, { fnr }: { fnr: string }) => {
            return data[fnr];
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
