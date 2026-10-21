import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { leggPåDagoverstyringer } from '@spesialist-mock/dagoverstyring';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, SELVSTENDIG_NÆRING, alleBehandlinger, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { UUID } from '@typer/spesialist-mock';
import '@utils/dayjs.setup';
import { isNotNullOrUndefined } from '@utils/typeguards';

import { BeregnetPeriode, Egenskap, Historikkinnslag, Person } from './schemaTypes';
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
let historikkinnslagErLastet = false;

export function hentSaksbilde(personPseudoId: string): ApiSaksbildePerson | undefined {
    if (!historikkinnslagErLastet) {
        puttHistorikkinnslagFraTestpersonerIMock();
        historikkinnslagErLastet = true;
    }
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
    if (!fødselsnummer) return undefined;
    const person = fetchPersondata()[fødselsnummer];
    valgtPerson = person;
    return person ? tilSaksbilde(person) : undefined;
}

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

type JsonObjekt = Record<string, unknown>;

function tilSaksbilde(person: Person): ApiSaksbildePerson {
    const kopi = utenTypename(structuredClone(person)) as JsonObjekt;
    const inntektsforhold = [
        ...(kopi.arbeidsgivere as JsonObjekt[]),
        ...(kopi.selvstendigNaering ? [kopi.selvstendigNaering as JsonObjekt] : []),
    ];
    for (const forhold of inntektsforhold) {
        for (const overstyring of forhold.overstyringer as JsonObjekt[])
            overstyring.type = overstyringstype(overstyring);
        for (const behandling of forhold.behandlinger as JsonObjekt[]) {
            for (const periode of behandling.perioder as JsonObjekt[]) {
                periode.type = (periode.utbetaling as JsonObjekt | undefined)?.id
                    ? 'ApiBeregnetPeriode'
                    : 'ApiUberegnetPeriode';
                for (const hendelse of (periode.hendelser as JsonObjekt[] | undefined) ?? []) {
                    hendelse.hendelsetype = hendelse.type;
                    hendelse.type = hendelsestype(hendelse.type as string);
                }
                for (const innslag of (periode.historikkinnslag as JsonObjekt[] | undefined) ?? []) {
                    innslag.historikktype = innslag.type;
                    innslag.type = historikkinnslagtype(innslag.type as string);
                }
            }
        }
    }
    for (const grunnlag of kopi.vilkarsgrunnlagV2 as JsonObjekt[]) {
        grunnlag.type =
            typeof grunnlag.grunnbelop === 'number' ? 'ApiVilkårsgrunnlagSpleisV2' : 'ApiVilkårsgrunnlagInfotrygdV2';
    }
    return kopi as unknown as ApiSaksbildePerson;
}

function utenTypename(verdi: unknown): unknown {
    if (Array.isArray(verdi)) return verdi.map(utenTypename);
    if (verdi !== null && typeof verdi === 'object') {
        return Object.fromEntries(
            Object.entries(verdi)
                .filter(([nøkkel]) => nøkkel !== '__typename')
                .map(([nøkkel, v]) => [nøkkel, utenTypename(v)]),
        );
    }
    return verdi;
}

function overstyringstype(overstyring: JsonObjekt): string {
    return overstyring.dager
        ? 'ApiDagoverstyring'
        : overstyring.inntekt
          ? 'ApiInntektoverstyring'
          : overstyring.skjonnsfastsatt
            ? 'ApiSykepengegrunnlagskjonnsfastsetting'
            : overstyring.minimumSykdomsgrad
              ? 'ApiMinimumSykdomsgradOverstyring'
              : 'ApiArbeidsforholdoverstyring';
}

function hendelsestype(type: string): string {
    switch (type) {
        case 'INNTEKTSMELDING':
            return 'ApiInntektsmelding';
        case 'NY_SOKNAD':
            return 'ApiSykmelding';
        case 'SENDT_SOKNAD_ARBEIDSGIVER':
            return 'ApiSoknadArbeidsgiver';
        case 'SENDT_SOKNAD_NAV':
            return 'ApiSoknadNav';
        case 'SENDT_SOKNAD_ARBEIDSLEDIG':
            return 'ApiSoknadArbeidsledig';
        case 'SENDT_SOKNAD_FRILANS':
            return 'ApiSoknadFrilans';
        case 'INNTEKT_HENTET_FRA_AORDNINGEN':
            return 'ApiInntektHentetFraAOrdningen';
        case 'SENDT_SOKNAD_SELVSTENDIG':
            return 'ApiSoknadSelvstendig';
        default:
            throw Error(`Fant hendelse med ukjent type: ${type}`);
    }
}

function historikkinnslagtype(type: string): string {
    switch (type) {
        case 'LEGG_PA_VENT':
            return 'ApiLagtPaVent';
        case 'ENDRE_PA_VENT':
            return 'ApiEndrePaVent';
        case 'FJERN_FRA_PA_VENT':
            return 'ApiFjernetFraPaVent';
        case 'TOTRINNSVURDERING_RETUR':
            return 'ApiTotrinnsvurderingRetur';
        case 'STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER':
            return 'ApiStansAutomatiskBehandlingSaksbehandler';
        case 'OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER':
            return 'ApiOpphevStansAutomatiskBehandlingSaksbehandler';
        default:
            return 'ApiPeriodeHistorikkElementNy';
    }
}
