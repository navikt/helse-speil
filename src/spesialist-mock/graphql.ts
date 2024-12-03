import spesialistSchema from './graphql.schema.json';
import dayjs from 'dayjs';
import fs from 'fs';
import { GraphQLError, GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';

import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';
import { Maybe } from '@io/graphql';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { Oppgave, UUID } from '@typer/spesialist-mock';

import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { behandledeOppgaverliste, oppgaveliste } from './data/oppgaveoversikt';
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
    FiltreringInput,
    Historikkinnslag,
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
    MutationSendTilGodkjenningV2Args,
    MutationSettVarselstatusArgs,
    Notat,
    NotatType,
    OppgavesorteringInput,
    PeriodehistorikkType,
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
                const oppgavereferanse: Maybe<string> = periode.oppgave?.id ?? null;
                const oppgave: Maybe<Oppgave> = oppgavereferanse ? OppgaveMock.getOppgave(oppgavereferanse) : null;

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
            const tildelinger = TildelingMock.getTildelingerFor('11111111-2222-3333-4444-555555555555');
            const paVent = PaVentMock.getPåVentFor('11111111-2222-3333-4444-555555555555');
            return {
                antallMineSaker: tildelinger.length,
                antallMineSakerPaVent: paVent.length,
            };
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
            return NotatMock.addNotat(vedtaksperiodeId, {
                tekst: tekst,
                type: type,
                dialogRef: DialogMock.addDialog()!!,
            });
        },
        feilregistrerNotat: (_, { id }: MutationFeilregistrerNotatArgs) => {
            NotatMock.feilregistrerNotat({ id });
            return NotatMock.getNotat(id);
        },
        feilregistrerKommentar: (_, { id }: MutationFeilregistrerKommentarArgs) => {
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
        innvilgVedtak: async () => {
            return (
                Math.random() < 0.95 ||
                new GraphQLError(`Oppgaven er ikke åpen.`, {
                    extensions: { code: { value: 500 } },
                })
            );
        },
        fattVedtak: async () => {
            return (
                Math.random() < 0.95 ||
                new GraphQLError(`Oppgaven er ikke åpen.`, {
                    extensions: { code: { value: 500 } },
                })
            );
        },
        sendTilInfotrygd: async () => {
            return (
                Math.random() < 0.95 ||
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
                    case 'INNTEKT_HENTET_FRA_AORDNINGEN':
                        return 'InntektHentetFraAOrdningen';
                    default:
                        throw Error(`Fant hendelse med ukjent type: ${hendelse.type}`);
                }
            })();
        },
    },
    Overstyring: {
        __resolveType: (overstyring: {
            dager?: Array<object>;
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
                case 'OPPDATER_PA_VENT_FRIST':
                    return 'OppdaterPaVentFrist';
                case 'FJERN_FRA_PA_VENT':
                    return 'FjernetFraPaVent';
                case 'TOTRINNSVURDERING_RETUR':
                    return 'TotrinnsvurderingRetur';
                default:
                    return 'PeriodeHistorikkElementNy';
            }
        },
    },
});

const finnOppgaveId = () => {
    if (!valgtPerson) return;

    return valgtPerson.arbeidsgivere
        .flatMap((a) => a.generasjoner.flatMap((g) => g.perioder))
        .find((periode) => (periode as BeregnetPeriode).oppgave)?.id;
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
                    if (!!(p as BeregnetPeriode).historikkinnslag) {
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
