import fs from 'fs';
import path from 'path';
import { sleep } from 'deasync';
import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildClientSchema, GraphQLSchema, IntrospectionQuery } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';

import { NotFoundError } from './errors';
import { NotatMock } from './storage/notat';
import { OppgaveMock } from './storage/oppgave';
import { getMockOppdrag } from './data/oppdrag';
import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import type { BeregnetPeriode, Person } from './schemaTypes';

import spesialistSchema from '../graphql.schema.json';
import { ferdigstilteOppgaver } from './data/ferdigstilteOppgaver';

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const generasjon of arbeidsgiver.generasjoner) {
            for (const periode of generasjon.perioder as Array<BeregnetPeriode>) {
                if (OppgaveMock.isAssigned(periode)) {
                    tildeling = {
                        epost: 'epost@nav.no',
                        navn: 'Utvikler, Lokal',
                        oid: 'uuid',
                        reservert: OppgaveMock.isOnHold(periode),
                    };
                }

                periode.notater = NotatMock.getNotaterForPeriode(periode);
                periode.erBeslutterOppgave = OppgaveMock.isBeslutteroppgave(periode);
                periode.erReturOppgave = OppgaveMock.isReturoppgave(periode);
                periode.tidligereSaksbehandlerOid = OppgaveMock.getTidligereSaksbehandlerOid(periode);
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
        person: (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) {
                throw new NotFoundError(fnr ?? aktorId ?? '');
            }
            sleep(500);
            return person;
        },
        oppdrag: (_, { fnr }: { fnr: string }) => {
            return getMockOppdrag();
        },
        ferdigstilteOppgaver: () => {
            return ferdigstilteOppgaver;
        },
        behandlingsstatistikk: () => {
            sleep(1000);
            return behandlingsstatistikk;
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
