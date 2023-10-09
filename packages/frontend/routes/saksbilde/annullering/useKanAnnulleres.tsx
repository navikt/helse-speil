import { Oppdrag, Spennoppdrag } from '@io/graphql';

import { getTom } from '../utbetalingshistorikk/utbetalingshistorikkUtils';

type OppdragPerMottakere = { [key: string]: Spennoppdrag[] };
type NyestePerMottaker = { [key: string]: Spennoppdrag };

const nyesteFørst = (a: Spennoppdrag, b: Spennoppdrag) =>
    (getTom(a) ?? 0) < (getTom(b) ?? 0) ? -1 : (getTom(a) ?? 0) > (getTom(b) ?? 0) ? 1 : 0;

// Dette er litt rotete kode, det er fritt fram å skrive om, bytte datatyper eller lignende :-)
const sorterteOppdragNyesteFørst = (oppdrag: Oppdrag[]): NyestePerMottaker => {
    const annulleringsprospekter = oppdrag.filter(
        (o) => (o.type === 'UTBETALING' || o.type === 'REVURDERING') && o.status === 'UTBETALT',
    );
    const gruppertPåMottaker: OppdragPerMottakere = annulleringsprospekter.reduce(
        (acc: { [key: string]: Spennoppdrag[] }, curr: Oppdrag) => {
            if (curr.arbeidsgiveroppdrag != null)
                if (curr.arbeidsgiveroppdrag?.linjer.length ?? 0 > 0) {
                    const orgnr = curr.arbeidsgiveroppdrag.organisasjonsnummer;
                    acc[orgnr] = [...(acc[orgnr] !== undefined ? acc[orgnr] : []), curr.arbeidsgiveroppdrag];
                }
            const personoppdrag = curr.personoppdrag;
            if (personoppdrag != null)
                if (personoppdrag?.linjer.length ?? 0 > 0) {
                    const fnr = personoppdrag.fodselsnummer;
                    acc[fnr] = [...(acc[fnr] != undefined ? acc[fnr] : []), personoppdrag];
                }
            return acc;
        },
        {},
    );

    return Object.entries(gruppertPåMottaker).reduce(
        (acc: NyestePerMottaker, [mottaker, oppdrag]: [string, Spennoppdrag[]]) => {
            const nyesteOppdrag = oppdrag.sort(nyesteFørst).pop();
            if (nyesteOppdrag != undefined) acc[mottaker] = nyesteOppdrag;

            return acc;
        },
        {},
    );
};

export const useKanAnnulleres = (oppdrag: Oppdrag[]) => {
    const nyestePerMottaker: NyestePerMottaker = sorterteOppdragNyesteFørst(oppdrag);
    return (oppdrag: Spennoppdrag): boolean => {
        return Object.values(nyestePerMottaker).some((value) => value.fagsystemId === oppdrag.fagsystemId);
    };
};
