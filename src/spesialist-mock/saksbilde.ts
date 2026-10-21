import {
    ApiBeregnetPeriode,
    ApiEgenskap,
    ApiHistorikkinnslag,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { leggPåDagoverstyringer } from '@spesialist-mock/dagoverstyring';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, SELVSTENDIG_NÆRING, alleBehandlinger, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { UUID } from '@typer/spesialist-mock';
import '@utils/dayjs.setup';
import { isNotNullOrUndefined } from '@utils/typeguards';

import { BehandlingMock } from './storage/behandling';
import { PaVentMock } from './storage/påvent';
import { TildelingMock } from './storage/tildeling';
import { VarselMock } from './storage/varsel';

const leggTilLagretData = (person: ApiSaksbildePerson): void => {
    let tildeling = person.tildeling;
    const pseudoId = PersonMock.findPersonPseudoId(person.fodselsnummer)!;

    for (const behandling of alleBehandlinger(person)) {
        for (const periode of behandling.perioder as ApiBeregnetPeriode[]) {
            // Hentes før endringene legges på, siden en ferdigstilt oppgave fjernes fra perioden
            const oppgaveId = periode.oppgave?.id;
            BehandlingMock.leggPåEndringer(periode);

            if (periode.oppgave?.id && TildelingMock.harTildeling(pseudoId)) {
                tildeling = TildelingMock.getTildeling(pseudoId);
            }

            if (oppgaveId && PaVentMock.finnesIMock(oppgaveId)) {
                periode.paVent = PaVentMock.getPåVent(oppgaveId);
                if (periode.paVent === null || periode.paVent === undefined) {
                    periode.egenskaper = periode.egenskaper.filter((e) => e.egenskap !== ApiEgenskap.PA_VENT);
                }
            }

            periode.historikkinnslag = HistorikkinnslagMock.getHistorikkinnslag(periode.vedtaksperiodeId);
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

const lesTestpersoner = (): ApiSaksbildePerson[] => lesTestpersonfiler().map((fil) => fil.saksbilde);

export const fetchPersondata = (): Record<string, ApiSaksbildePerson> => {
    const personer = lesTestpersoner();

    return personer.reduce((data: Record<string, ApiSaksbildePerson>, person) => {
        leggTilLagretData(person);
        data[person.aktorId] = person;
        data[person.fodselsnummer] = person;
        return data;
    }, {});
};

let valgtPerson: ApiSaksbildePerson | undefined;
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
    return person;
}

export const finnOppgaveId = (): string | null => {
    if (!valgtPerson) return null;
    const periode = alleBehandlinger(valgtPerson)
        .flatMap((g) => g.perioder)
        .find((periode) => isNotNullOrUndefined((periode as ApiBeregnetPeriode).oppgave));

    return (periode as ApiBeregnetPeriode)?.oppgave?.id ?? null;
};

const puttHistorikkinnslagFraTestpersonerIMock = (): void => {
    const personer = lesTestpersoner();

    personer.forEach((person) => {
        const vedtaksperiodeHistorikkinnslag = new Map<UUID, ApiHistorikkinnslag[]>();

        alleBehandlinger(person).forEach((g) => {
            g.perioder.forEach((p) => {
                if ((p as ApiBeregnetPeriode).historikkinnslag) {
                    vedtaksperiodeHistorikkinnslag.set(p.vedtaksperiodeId, (p as ApiBeregnetPeriode).historikkinnslag);
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
