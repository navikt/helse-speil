import dayjs from 'dayjs';

import { unntakAndreLeddLabels } from '@form-schemas/oppholdskravSkjema';
import { ApiOppholdskravvurderingRequest } from '@io/rest/generated/avslagsdager/avslagsdager.schemas';
import { Handlingsvisning } from '@io/rest/handlingsvisning';
import { MANUELT_VURDERT_OPPHOLDSKRAV_HANDLING_ID } from '@spesialist-mock/storage/saksbehandlerhandling';
import { NORSK_DATOFORMAT } from '@utils/date';

type Lagringsresultat = { type: 'OK'; vurderingId: string } | { type: 'FEIL'; tittel: string };

export function lagreOppholdskravvurdering(request: ApiOppholdskravvurderingRequest): Lagringsresultat {
    const feil = valider(request);
    if (feil) return { type: 'FEIL', tittel: feil };

    const vurderingId = crypto.randomUUID();
    visninger.set(vurderingId, tilVisning(request));
    return { type: 'OK', vurderingId };
}

export function hentVisning(handlingId: string): Handlingsvisning | undefined {
    return visninger.get(handlingId);
}

// Samme felter og format som sp-avslagsdager svarer med
const visninger = new Map<string, Handlingsvisning>([
    [
        MANUELT_VURDERT_OPPHOLDSKRAV_HANDLING_ID,
        {
            felter: [
                { type: 'TEKST', tittel: 'Oppholdskrav', tekst: 'Ikke oppfylt' },
                { type: 'TEKST', tittel: 'EØS-borger', tekst: 'Ja' },
                { type: 'TEKST', tittel: 'Opphold i Norge, EØS eller avtaleland', tekst: 'Nei' },
                { type: 'TEKST', tittel: 'Unntak i andre ledd', tekst: 'Nei' },
                { type: 'TEKST', tittel: 'Godkjent opphold utenfor Norge i inntil fire uker', tekst: 'Nei' },
                { type: 'LISTE', tittel: 'Dager', elementer: ['15.07.2024–19.07.2024', '22.07.2024'] },
                { type: 'LISTE', tittel: 'Journalposter', elementer: ['453912345'] },
                {
                    type: 'TEKST',
                    tittel: 'Begrunnelse',
                    tekst: 'Personen oppholdt seg utenfor EØS i perioden, og ingen av unntakene gjelder.',
                },
            ],
        },
    ],
]);

// Samme regler og titler som sp-avslagsdager
function valider(request: ApiOppholdskravvurderingRequest): string | undefined {
    if (request.dager.length === 0) return 'Dager må oppgis';
    if (request.fritekstbegrunnelse.trim() === '') return 'Fritekstbegrunnelse må oppgis';
    if (request.oppholdIGodkjentOmråde) return undefined;
    if (request.unntakAndreLedd == null) return 'Må svare på om et av unntakene i andre ledd gjelder';
    if (request.unntakAndreLedd === 'INGEN' && request.godkjentOppholdInntilFireUker == null)
        return 'Må svare på om oppholdet er godkjent for inntil fire uker';
    return undefined;
}

// Svar på spørsmål som ikke ble stilt, er utelatt, slik sp-avslagsdager gjør ved lagring
function tilVisning(request: ApiOppholdskravvurderingRequest): Handlingsvisning {
    const { eøsBorger, oppholdIGodkjentOmråde, unntakAndreLedd, godkjentOppholdInntilFireUker } = request;
    const felter: Handlingsvisning['felter'] = [
        { type: 'TEKST', tittel: 'Oppholdskrav', tekst: erOppfylt(request) ? 'Oppfylt' : 'Ikke oppfylt' },
        { type: 'TEKST', tittel: 'EØS-borger', tekst: jaNei(eøsBorger) },
        {
            type: 'TEKST',
            tittel: eøsBorger ? 'Opphold i Norge, EØS eller avtaleland' : 'Opphold i Norge',
            tekst: jaNei(oppholdIGodkjentOmråde),
        },
    ];
    if (!oppholdIGodkjentOmråde && unntakAndreLedd) {
        felter.push({ type: 'TEKST', tittel: 'Unntak i andre ledd', tekst: unntakAndreLeddLabels[unntakAndreLedd] });
        if (unntakAndreLedd === 'INGEN' && godkjentOppholdInntilFireUker != null) {
            felter.push({
                type: 'TEKST',
                tittel: 'Godkjent opphold utenfor Norge i inntil fire uker',
                tekst: jaNei(godkjentOppholdInntilFireUker),
            });
        }
    }
    felter.push({ type: 'LISTE', tittel: 'Dager', elementer: sammenhengendePerioder(request.dager) });
    if (request.journalpostId.length > 0) {
        felter.push({ type: 'LISTE', tittel: 'Journalposter', elementer: request.journalpostId });
    }
    felter.push({ type: 'TEKST', tittel: 'Begrunnelse', tekst: request.fritekstbegrunnelse });
    return { felter };
}

function erOppfylt(request: ApiOppholdskravvurderingRequest): boolean {
    return (
        request.oppholdIGodkjentOmråde ||
        request.unntakAndreLedd === 'MEDLEM_ETTER_2_5_2_6_2_8' ||
        request.unntakAndreLedd === 'INNLAGT_I_HELSEINSTITUSJON' ||
        request.godkjentOppholdInntilFireUker === true
    );
}

function sammenhengendePerioder(dager: string[]): string[] {
    const sorterte = [...dager].sort().map((dag) => dayjs(dag));
    const perioder: { fom: dayjs.Dayjs; tom: dayjs.Dayjs }[] = [];
    for (const dag of sorterte) {
        const forrige = perioder.at(-1);
        if (forrige && forrige.tom.add(1, 'day').isSame(dag, 'day')) forrige.tom = dag;
        else perioder.push({ fom: dag, tom: dag });
    }
    return perioder.map(({ fom, tom }) =>
        fom.isSame(tom, 'day')
            ? fom.format(NORSK_DATOFORMAT)
            : `${fom.format(NORSK_DATOFORMAT)}–${tom.format(NORSK_DATOFORMAT)}`,
    );
}

function jaNei(svar: boolean): string {
    return svar ? 'Ja' : 'Nei';
}
