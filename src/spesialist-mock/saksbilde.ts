import {
    ApiBeregnetPeriode,
    ApiEgenskap,
    ApiHistorikkinnslag,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { leggPåDagoverstyringer } from '@spesialist-mock/dagoverstyring';
import { finnAktivOppgave, finnOppgaveFraTestperson } from '@spesialist-mock/storage/aktivOppgave';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMedKommentarer, HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, SELVSTENDIG_NÆRING, alleBehandlinger, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { UUID } from '@typer/spesialist-mock';
import '@utils/dayjs.setup';

import { BehandlingMock } from './storage/behandling';
import { PaVentMock } from './storage/påvent';
import { VarselMock } from './storage/varsel';

const leggTilLagretData = (person: ApiSaksbildePerson): void => {
    // Også en ferdigstilt oppgave kan ha påVent i mocken
    const oppgave = finnOppgaveFraTestperson(person.fodselsnummer);

    for (const behandling of alleBehandlinger(person)) {
        for (const periode of behandling.perioder as ApiBeregnetPeriode[]) {
            BehandlingMock.leggPåEndringer(periode);

            const oppgaveId =
                periode.type === 'ApiBeregnetPeriode' && oppgave?.vedtaksperiodeId === periode.vedtaksperiodeId
                    ? oppgave.id
                    : undefined;
            if (oppgaveId && PaVentMock.finnesIMock(oppgaveId) && !PaVentMock.erPåVent(oppgaveId)) {
                periode.egenskaper = periode.egenskaper.filter((e) => e.egenskap !== ApiEgenskap.PA_VENT);
            }

            periode.historikkinnslag = HistorikkinnslagMock.getHistorikkinnslag(periode.vedtaksperiodeId);
            periode.varsler = VarselMock.getVarslerForPeriode(periode.varsler);
        }
    }

    for (const arbeidsgiver of person.arbeidsgivere) {
        // Seedede overstyringer er allerede med i tidslinja i testdataene
        leggPåDagoverstyringer(
            arbeidsgiver,
            OverstyringMock.hentFor(person.fodselsnummer, arbeidsgiver.organisasjonsnummer),
        );
    }
    const selvstendigErArbeidsgiver = person.arbeidsgivere.some((it) => it.organisasjonsnummer === SELVSTENDIG_NÆRING);
    if (person.selvstendigNaering && !selvstendigErArbeidsgiver) {
        leggPåDagoverstyringer(
            person.selvstendigNaering,
            OverstyringMock.hentFor(person.fodselsnummer, SELVSTENDIG_NÆRING),
        );
    }
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

export const finnOppgaveId = (): string | null =>
    valgtPerson ? (finnAktivOppgave(valgtPerson.fodselsnummer)?.id ?? null) : null;

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
