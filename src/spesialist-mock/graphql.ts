import spesialistSchema from './graphql.schema.json';
import dayjs from 'dayjs';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';
import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { sleep } from '@spesialist-mock/constants';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';
import { PersonMock } from '@spesialist-mock/storage/person';
import { StansAutomatiskBehandlingMock } from '@spesialist-mock/storage/stansautomatiskbehandling';
import { Oppgave, UUID } from '@typer/spesialist-mock';
import '@utils/dayjs.setup';
import { isNotNullOrUndefined } from '@utils/typeguards';

import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { behandledeOppgaverliste } from './data/oppgaveoversikt';
import { ManglendeAvviksvurderingError, NotReadyError } from './errors';
import {
    Arbeidsgiver,
    BeregnetPeriode,
    Egenskap,
    Historikkinnslag,
    MutationFjernPaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaVentArgs,
    MutationOppdaterPersonArgs,
    MutationOpphevStansAutomatiskBehandlingArgs,
    MutationOpprettTildelingArgs,
    MutationSendIReturArgs,
    MutationSendTilGodkjenningV2Args,
    MutationStansAutomatiskBehandlingArgs,
    PeriodehistorikkType,
    Person,
} from './schemaTypes';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';
import { OpphevStansMock } from './storage/opphevstans';
import { PaVentMock } from './storage/påvent';
import { TildelingMock } from './storage/tildeling';
import { VarselMock } from './storage/varsel';

type PersonMedPseudoId = Person & { personPseudoId: string };

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const behandling of arbeidsgiver.behandlinger) {
            for (const periode of behandling.perioder as BeregnetPeriode[]) {
                if (periode.oppgave?.id && TildelingMock.harTildeling(periode.oppgave.id)) {
                    tildeling = TildelingMock.getTildeling(periode.oppgave.id);
                }

                if (periode.oppgave?.id && PaVentMock.finnesIMock(periode.oppgave.id)) {
                    periode.paVent = PaVentMock.getPåVent(periode.oppgave.id);
                    if (periode.paVent === null || periode.paVent === undefined) {
                        periode.egenskaper = periode.egenskaper.filter((e) => e.egenskap !== Egenskap.PaVent);
                    }
                }

                periode.historikkinnslag = HistorikkinnslagMock.getHistorikkinnslag(
                    periode.vedtaksperiodeId,
                ) as Historikkinnslag[];
                periode.varsler = VarselMock.getVarslerForPeriode(periode.varsler);
                const oppgavereferanse: string | null = periode.oppgave?.id ?? null;
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
    if (lagretUnntattFraAutomatiskGodkjenning) {
        person.personinfo.unntattFraAutomatisering = lagretUnntattFraAutomatiskGodkjenning;
    }

    const lagretStansAvSaksbehandler = StansAutomatiskBehandlingMock.getStansAutomatiskBehandling(person.fodselsnummer);
    if (lagretStansAvSaksbehandler) {
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler = lagretStansAvSaksbehandler;
    }
    person.tildeling = tildeling;
};

const lesTestpersoner = (): PersonMedPseudoId[] => {
    const url = path.join(cwd(), 'src/spesialist-mock/data/personer');
    const filenames = fs.readdirSync(url);
    return filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw).data.person;
    });
};

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
        behandledeOppgaverFeed: async (
            _,
            { offset, limit, fom, tom }: { offset: number; limit: number; fom: string; tom: string },
        ) => {
            return behandledeOppgaverliste(offset, limit, fom, tom);
        },
        behandlingsstatistikk: async () => {
            return behandlingsstatistikk;
        },
        antallOppgaver: async () => {
            const tildelinger = TildelingMock.getTildelingerFor('11111111-2222-3333-4444-555555555555');
            const paVent = PaVentMock.getPåVentFor('11111111-2222-3333-4444-555555555555');
            return {
                antallMineSaker: tildelinger.length,
                antallMineSakerPaVent: paVent.length,
            };
        },
    },
    Mutation: {
        opprettTildeling: async (_, { oppgaveId }: MutationOpprettTildelingArgs) => {
            if (TildelingMock.harTildeling(oppgaveId)) {
                return new GraphQLError('Oppgave allerede tildelt', {
                    extensions: {
                        code: 409,
                        tildeling: TildelingMock.getTildeling(oppgaveId),
                    },
                });
            }
            if (Math.random() > 0.95) {
                return new GraphQLError(`Kunne ikke tildele oppgave med oppgaveId=${oppgaveId}`, {
                    extensions: { code: 500 },
                });
            }
            TildelingMock.setTildeling(oppgaveId, {
                epost: 'epost@nav.no',
                navn: 'Utvikler, Lokal',
                oid: '11111111-2222-3333-4444-555555555555',
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
        leggPaVent: async (_, { oppgaveId, notatTekst, frist, tildeling, arsaker }: MutationLeggPaVentArgs) => {
            if (tildeling) {
                TildelingMock.setTildeling(oppgaveId, {
                    epost: 'epost@nav.no',
                    navn: 'Utvikler, Lokal',
                    oid: '11111111-2222-3333-4444-555555555555',
                });
            }
            HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
                notattekst: notatTekst,
                frist: frist,
                arsaker: arsaker ? arsaker.map((arsak) => arsak.arsak) : [],
                type: PeriodehistorikkType.LeggPaVent,
                dialogRef: DialogMock.addDialog(),
            });
            PaVentMock.setPåVent(oppgaveId, {
                frist: dayjs().format('YYYY-MM-DD'),
                oid: '11111111-2222-3333-4444-555555555555',
            });
            return PaVentMock.getPåVent(oppgaveId);
        },
        fjernPaVent: async (_, { oppgaveId }: MutationFjernPaVentArgs) => {
            HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
                type: PeriodehistorikkType.FjernFraPaVent,
            });
            PaVentMock.fjernPåVent(oppgaveId);
            return true;
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
        sendTilGodkjenningV2: async (_, { oppgavereferanse }: MutationSendTilGodkjenningV2Args) => {
            const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
            const oppgave: Oppgave = {
                ...getDefaultOppgave(),
                id: oppgavereferanse,
                tildelt:
                    tidligereSaksbehandler === '11111111-2222-3333-4444-555555555555'
                        ? null
                        : '11111111-2222-3333-4444-555555555555',
                totrinnsvurdering: {
                    erRetur: false,
                    erBeslutteroppgave: true,
                    saksbehandler: '11111111-2222-3333-4444-555555555555',
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
                    saksbehandler: '11111111-2222-3333-4444-555555555555',
                    erRetur: true,
                    erBeslutteroppgave: false,
                },
            };

            OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);

            HistorikkinnslagMock.addHistorikkinnslag(oppgavereferanse, {
                type: PeriodehistorikkType.TotrinnsvurderingRetur,
                notattekst: notatTekst,
                dialogRef: DialogMock.addDialog(),
            });
            return true;
        },
        oppdaterPerson: async (_, { fodselsnummer }: MutationOppdaterPersonArgs) => {
            await sleep(800);
            OpptegnelseMock.pushOpptegnelse(fodselsnummer, ApiOpptegnelseType.PERSONDATA_OPPDATERT);
            return true;
        },
        stansAutomatiskBehandling: async (_, { fodselsnummer, begrunnelse }: MutationStansAutomatiskBehandlingArgs) => {
            const oppgaveId = finnOppgaveId();
            StansAutomatiskBehandlingMock.stansAutomatiskBehandling(fodselsnummer, true);
            if (oppgaveId) {
                HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
                    type: PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler,
                    notattekst: begrunnelse,
                    dialogRef: DialogMock.addDialog(),
                });
            }
            return true;
        },
        opphevStansAutomatiskBehandling: async (
            _,
            { fodselsnummer, begrunnelse }: MutationOpphevStansAutomatiskBehandlingArgs,
        ) => {
            const oppgaveId = finnOppgaveId();
            StansAutomatiskBehandlingMock.stansAutomatiskBehandling(fodselsnummer, false);
            if (oppgaveId) {
                HistorikkinnslagMock.addHistorikkinnslag(oppgaveId, {
                    type: PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler,
                    notattekst: begrunnelse,
                    dialogRef: DialogMock.addDialog(),
                });
            }
            return true;
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string; vilkarsgrunnlagId: string }) => {
            return periode.beregningId ? 'BeregnetPeriode' : 'UberegnetPeriode';
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

const finnOppgaveId = (): string | null => {
    if (!valgtPerson) return null;
    const periode = valgtPerson.arbeidsgivere
        .flatMap((a) => a.behandlinger.flatMap((g) => g.perioder))
        .find((periode) => isNotNullOrUndefined((periode as BeregnetPeriode).oppgave));

    return (periode as BeregnetPeriode)?.oppgave?.id ?? null;
};

const puttHistorikkinnslagFraTestpersonerIMock = (): void => {
    const personer = lesTestpersoner();

    personer.forEach((person) => {
        const vedtaksperiodeHistorikkinnslag = new Map<UUID, Historikkinnslag[]>();

        person.arbeidsgivere.forEach((ag: Arbeidsgiver) => {
            ag.behandlinger.forEach((g) => {
                g.perioder.forEach((p) => {
                    if ((p as BeregnetPeriode).historikkinnslag) {
                        vedtaksperiodeHistorikkinnslag.set(p.vedtaksperiodeId, (p as BeregnetPeriode).historikkinnslag);
                    }
                });
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
