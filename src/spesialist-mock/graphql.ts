import spesialistSchema from './graphql.schema.json';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { StansAutomatiskBehandlingMock } from '@spesialist-mock/storage/stansautomatiskbehandling';
import { Oppgave, UUID } from '@typer/spesialist-mock';
import { isNotNullOrUndefined } from '@utils/typeguards';

import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { behandledeOppgaverliste } from './data/oppgaveoversikt';
import {
    BeingPreparedError,
    FlereFodselsnumreError,
    ManglendeAvviksvurderingError,
    NotFoundError,
    NotReadyError,
} from './errors';
import { hentOpptegnelser, opprettAbonnement } from './opptegnelser';
import {
    Arbeidsgiver,
    BeregnetPeriode,
    Egenskap,
    Historikkinnslag,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    MutationFjernPaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaVentArgs,
    MutationLeggTilKommentarArgs,
    MutationLeggTilNotatArgs,
    MutationOpphevStansArgs,
    MutationOpphevStansAutomatiskBehandlingArgs,
    MutationOpprettTildelingArgs,
    MutationSendIReturArgs,
    MutationSendTilGodkjenningV2Args,
    MutationSettVarselstatusArgs,
    MutationStansAutomatiskBehandlingArgs,
    Notat,
    NotatType,
    PeriodehistorikkType,
    Person,
} from './schemaTypes';
import { NotatMock } from './storage/notat';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';
import { OpphevStansMock } from './storage/opphevstans';
import { PaVentMock } from './storage/påvent';
import { TildelingMock } from './storage/tildeling';
import { VarselMock } from './storage/varsel';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const generasjon of arbeidsgiver.generasjoner) {
            for (const periode of generasjon.perioder as BeregnetPeriode[]) {
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
                periode.notater = NotatMock.getNotaterForPeriode(periode);
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

const lesTestpersoner = (): Person[] => {
    const url = path.join(cwd(), 'src/spesialist-mock/data/personer');
    const filenames = fs.readdirSync(url);
    return filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw).data.person;
    });
};

const fetchPersondata = (): Record<string, Person> => {
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
        person: async (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            if (aktorId == '1000000000001') return new FlereFodselsnumreError();
            if (aktorId == '1000000000002') return new NotReadyError();
            if (aktorId == '1000000000003') return new ManglendeAvviksvurderingError();
            if (aktorId == '1000000000004') return new BeingPreparedError();
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) return new NotFoundError(fnr ?? aktorId ?? '');
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
        opptegnelser: async (_, { sekvensId }) => {
            return hentOpptegnelser(sekvensId);
        },
    },
    Mutation: {
        leggTilNotat: (_, { type, vedtaksperiodeId, tekst }: MutationLeggTilNotatArgs) => {
            return NotatMock.addNotat(vedtaksperiodeId, {
                tekst: tekst,
                type: type,
                dialogRef: DialogMock.addDialog() ?? undefined,
            });
        },
        feilregistrerNotat: (_, { id }: MutationFeilregistrerNotatArgs) => {
            NotatMock.feilregistrerNotat({ id });
            return NotatMock.getNotat(id);
        },
        feilregistrerKommentar: (_, { id }: MutationFeilregistrerKommentarArgs) => {
            // Fungerer bare for generelle notater, ikke lagt på vent osv
            NotatMock.feilregistrerKommentar({ id });
            return NotatMock.getKommentar(id);
        },
        leggTilKommentar: (_, { tekst, dialogRef, saksbehandlerident }: MutationLeggTilKommentarArgs) => {
            return DialogMock.addKommentar(dialogRef, { tekst, saksbehandlerident });
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
        fattVedtak: async () => {
            return (
                Math.random() < 0.95 ||
                new GraphQLError(`Oppgaven er ikke åpen.`, {
                    extensions: { code: 500 },
                })
            );
        },
        sendTilInfotrygd: async () => {
            return (
                Math.random() < 0.95 ||
                new GraphQLError(`Allerede sendt til Infotrygd`, {
                    extensions: { code: 409 },
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
        .flatMap((a) => a.generasjoner.flatMap((g) => g.perioder))
        .find((periode) => isNotNullOrUndefined((periode as BeregnetPeriode).oppgave));

    return (periode as BeregnetPeriode)?.oppgave?.id ?? null;
};

// Henter notater fra testpersonene og putter dem inn i NotatMock, slik at de er synlige på oversikten også
const puttNotaterFraTestpersonerIMock = (): void => {
    const personer = lesTestpersoner();

    personer.forEach((person) => {
        const notater: Notat[] = person.arbeidsgivere.flatMap((ag: Arbeidsgiver) =>
            ag.generasjoner
                .flatMap((g) => g.perioder.flatMap((p) => (p as BeregnetPeriode).notater))
                .filter((notat: Notat) => !!notat),
        );
        notater.forEach((notat) => {
            const dialogId = notat.dialogRef;
            DialogMock.addDialog(dialogId);
            NotatMock.addNotat(notat.vedtaksperiodeId, notat);
            DialogMock.addKommentarer(dialogId, notat.kommentarer);
        });
    });
};

const puttHistorikkinnslagFraTestpersonerIMock = (): void => {
    const personer = lesTestpersoner();

    personer.forEach((person) => {
        const vedtaksperiodeHistorikkinnslag = new Map<UUID, Historikkinnslag[]>();

        person.arbeidsgivere.forEach((ag: Arbeidsgiver) => {
            ag.generasjoner.forEach((g) => {
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
    puttNotaterFraTestpersonerIMock();
    puttHistorikkinnslagFraTestpersonerIMock();
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};
