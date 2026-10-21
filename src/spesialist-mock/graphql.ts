import spesialistSchema from './graphql.schema.json';
import { GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';
import { leggPåDagoverstyringer } from '@spesialist-mock/dagoverstyring';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, SELVSTENDIG_NÆRING, alleBehandlinger, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { UUID } from '@typer/spesialist-mock';
import '@utils/dayjs.setup';
import { isNotNullOrUndefined } from '@utils/typeguards';

import { ManglendeAvviksvurderingError, NotReadyError } from './errors';
import { BeregnetPeriode, Egenskap, Historikkinnslag, Person, Utbetaling } from './schemaTypes';
import { BehandlingMock } from './storage/behandling';
import { PaVentMock } from './storage/påvent';
import { TildelingMock } from './storage/tildeling';
import { VarselMock } from './storage/varsel';

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;
    const pseudoId = PersonMock.findPersonPseudoId(person.fodselsnummer)!;

    for (const behandling of alleBehandlinger(person)) {
        for (const periode of behandling.perioder as BeregnetPeriode[]) {
            // Hentes før endringene legges på, siden en ferdigstilt oppgave fjernes fra perioden
            const oppgaveId = periode.oppgave?.id;
            BehandlingMock.leggPåEndringer(periode);

            if (periode.oppgave?.id && TildelingMock.harTildeling(pseudoId)) {
                tildeling = TildelingMock.getTildeling(pseudoId);
            }

            if (oppgaveId && PaVentMock.finnesIMock(oppgaveId)) {
                periode.paVent = PaVentMock.getPåVent(oppgaveId);
                if (periode.paVent === null || periode.paVent === undefined) {
                    periode.egenskaper = periode.egenskaper.filter((e) => e.egenskap !== Egenskap.PaVent);
                }
            }

            periode.historikkinnslag = HistorikkinnslagMock.getHistorikkinnslag(
                periode.vedtaksperiodeId,
            ) as Historikkinnslag[];
            periode.varsler = VarselMock.getVarslerForPeriode(periode.varsler);
        }
    }

    for (const arbeidsgiver of person.arbeidsgivere) {
        const mockOverstyringer = OverstyringMock.hentFor(person.fodselsnummer, arbeidsgiver.organisasjonsnummer);
        arbeidsgiver.overstyringer = [...(arbeidsgiver.overstyringer ?? []), ...mockOverstyringer];
        // Seedede overstyringer er allerede med i tidslinja i testdataene
        leggPåDagoverstyringer(arbeidsgiver, mockOverstyringer);
    }
    const selvstendigErArbeidsgiver = person.arbeidsgivere.some((it) => it.organisasjonsnummer === SELVSTENDIG_NÆRING);
    if (person.selvstendigNaering && !selvstendigErArbeidsgiver) {
        const mockOverstyringer = OverstyringMock.hentFor(person.fodselsnummer, SELVSTENDIG_NÆRING);
        person.selvstendigNaering.overstyringer = [
            ...(person.selvstendigNaering.overstyringer ?? []),
            ...mockOverstyringer,
        ];
        leggPåDagoverstyringer(person.selvstendigNaering, mockOverstyringer);
    }

    person.tildeling = tildeling;
};

const lesTestpersoner = (): Person[] => lesTestpersonfiler().map((fil) => fil.data.person as unknown as Person);

export const fetchPersondata = (): Record<string, Person> => {
    const personer = lesTestpersoner();

    return personer.reduce((data: Record<string, Person>, person) => {
        leggTilLagretData(person);
        data[person.aktorId] = person;
        data[person.fodselsnummer] = person;
        return data;
    }, {});
};

let valgtPerson: Person | undefined;

const getResolvers = (): IResolvers => ({
    Query: {
        person: async (_, { personPseudoId }: { personPseudoId: string }) => {
            if (personPseudoId == '64b51f30-2f3f-4872-afb9-8f7f31ab6c36') return new NotReadyError();
            if (personPseudoId == 'b99b7845-f892-484c-b1d8-e070d2821bb6') return new ManglendeAvviksvurderingError();

            const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
            if (!fødselsnummer) throw Error('personPseudoId i person-query skal vel alltid tilhøre en person?');
            const person = fetchPersondata()[fødselsnummer];

            valgtPerson = person;
            return person;
        },
    },
    Periode: {
        __resolveType: (periode: { utbetaling: Utbetaling; vilkarsgrunnlagId: string }) => {
            return periode.utbetaling?.id ? 'BeregnetPeriode' : 'UberegnetPeriode';
        },
    },
    VilkarsgrunnlagV2: {
        __resolveType: (grunnlag: { grunnbelop?: number }) => {
            return typeof grunnlag.grunnbelop === 'number' ? 'VilkarsgrunnlagSpleisV2' : 'VilkarsgrunnlagInfotrygdV2';
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
                    case 'INNTEKT_HENTET_FRA_AORDNINGEN':
                        return 'InntektHentetFraAOrdningen';
                    case 'SENDT_SOKNAD_SELVSTENDIG':
                        return 'SoknadSelvstendig';
                    default:
                        throw Error(`Fant hendelse med ukjent type: ${hendelse.type}`);
                }
            })();
        },
    },
    Overstyring: {
        __resolveType: (overstyring: {
            dager?: object[];
            inntekt?: object;
            skjonnsfastsatt?: object;
            minimumSykdomsgrad?: object;
        }) =>
            overstyring.dager
                ? 'Dagoverstyring'
                : overstyring.inntekt
                  ? 'Inntektoverstyring'
                  : overstyring.skjonnsfastsatt
                    ? 'Sykepengegrunnlagskjonnsfastsetting'
                    : overstyring.minimumSykdomsgrad
                      ? 'MinimumSykdomsgradOverstyring'
                      : 'Arbeidsforholdoverstyring',
    },
    Historikkinnslag: {
        __resolveType: (historikkinnslag: { type: string }) => {
            switch (historikkinnslag.type) {
                case 'LEGG_PA_VENT':
                    return 'LagtPaVent';
                case 'ENDRE_PA_VENT':
                    return 'EndrePaVent';
                case 'FJERN_FRA_PA_VENT':
                    return 'FjernetFraPaVent';
                case 'TOTRINNSVURDERING_RETUR':
                    return 'TotrinnsvurderingRetur';
                case 'STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER':
                    return 'StansAutomatiskBehandlingSaksbehandler';
                case 'OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER':
                    return 'OpphevStansAutomatiskBehandlingSaksbehandler';
                default:
                    return 'PeriodeHistorikkElementNy';
            }
        },
    },
});

export const finnOppgaveId = (): string | null => {
    if (!valgtPerson) return null;
    const periode = alleBehandlinger(valgtPerson)
        .flatMap((g) => g.perioder)
        .find((periode) => isNotNullOrUndefined((periode as BeregnetPeriode).oppgave));

    return (periode as BeregnetPeriode)?.oppgave?.id ?? null;
};

const puttHistorikkinnslagFraTestpersonerIMock = (): void => {
    const personer = lesTestpersoner();

    personer.forEach((person) => {
        const vedtaksperiodeHistorikkinnslag = new Map<UUID, Historikkinnslag[]>();

        alleBehandlinger(person).forEach((g) => {
            g.perioder.forEach((p) => {
                if ((p as BeregnetPeriode).historikkinnslag) {
                    vedtaksperiodeHistorikkinnslag.set(p.vedtaksperiodeId, (p as BeregnetPeriode).historikkinnslag);
                }
            });
        });

        vedtaksperiodeHistorikkinnslag.forEach((historikkinnslagArray, vedtaksperiodeId) => {
            historikkinnslagArray.forEach((historikkinnslag) => {
                const dialogId = DialogMock.addDialog(
                    historikkinnslag.dialogRef !== undefined ? historikkinnslag.dialogRef : null,
                );
                HistorikkinnslagMock.addHistorikkinnslag(vedtaksperiodeId, {
                    ...historikkinnslag,
                    dialogRef: dialogId,
                });
                if (dialogId !== null) {
                    DialogMock.addKommentarer(
                        dialogId,
                        (historikkinnslag as HistorikkinnslagMedKommentarer).kommentarer,
                    );
                }
            });
        });
    });
};

export const buildSchema = (): GraphQLSchema => {
    puttHistorikkinnslagFraTestpersonerIMock();
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};
