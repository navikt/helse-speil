import { Dayjs } from 'dayjs';
import {
    Arbeidsgiver,
    Sykdomsdag,
    Tidslinjetilstand,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Utbetalingstype,
} from 'internal-types';

import { usePerson } from '../state/person';

const useHistorikkelement = (beregningId: string): Utbetalingshistorikkelement | undefined =>
    usePerson()
        ?.arbeidsgivere.flatMap((arb: Arbeidsgiver) => arb.utbetalingshistorikk)
        .find((element: Utbetalingshistorikkelement) => element.id === beregningId);

export interface Utbetalingshistorikkelement {
    id: string;
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetaling: UtbetalingshistorikkUtbetaling2;
    kilde: string;
    tidsstempel: Dayjs;
}

export const utbetalingshistorikkelement = (
    id: string,
    beregnettidslinje: Sykdomsdag[],
    hendelsetidslinje: Sykdomsdag[],
    utbetaling: UtbetalingshistorikkUtbetaling2,
    tidsstempel: Dayjs
): Utbetalingshistorikkelement => ({
    id: id,
    beregnettidslinje: beregnettidslinje,
    hendelsetidslinje: hendelsetidslinje,
    utbetaling: utbetaling,
    kilde: utbetaling.type,
    tidsstempel: tidsstempel,
});

export const useUtbetaling = (beregningId: string): UtbetalingshistorikkUtbetaling2 | undefined => {
    const element = useHistorikkelement(beregningId);
    if (!element) return undefined;
    return element.utbetaling;
};

export const useErAnnullert = (beregningId: string): boolean => {
    const fagsystemId = useUtbetaling(beregningId)?.arbeidsgiverFagsystemId!;
    const annullerteFagsystemider = useAnnulleringer()?.flatMap(
        (element) => element.utbetaling.arbeidsgiverFagsystemId
    );
    return annullerteFagsystemider?.includes(fagsystemId) ?? false;
};

export const useAnnulleringer = () =>
    usePerson()
        ?.arbeidsgivere.flatMap((arb) => arb.utbetalingshistorikk)
        .filter((element) => element.utbetaling.type === Utbetalingstype.ANNULLERING);

export const erUtbetaling = (utbetaling: UtbetalingshistorikkUtbetaling2) =>
    utbetaling.type === Utbetalingstype.UTBETALING;

export const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const erRevurderingsperiode = (periode: Tidslinjeperiode) => periode.type === Periodetype.REVURDERING;

export const useMaksdato = (beregningId: string) => useUtbetaling(beregningId)?.maksdato;

export const useNettobeløp = (beregningId: string) => useUtbetaling(beregningId)?.arbeidsgiverNettobeløp;

export const useGjenståendeDager = (beregningId: string) => useUtbetaling(beregningId)?.gjenståendeDager;

export interface Tidslinjeperiode {
    id: string;
    unique: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Tidslinjetilstand;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    fullstendig: boolean;
    opprettet: Dayjs;
    fagsystemId?: string;
    oppgavereferanse?: string;
}

export enum Utbetalingstatus {
    IKKE_UTBETALT,
    IKKE_GODKJENT,
    GODKJENT,
    SENDT,
    OVERFØRT,
    UTBETALT,
    GODKJENT_UTEN_UTBETALING,
    UTBETALING_FEILET,
    ANNULLERT,
    UKJENT,
}

export enum Periodetype {
    VEDTAKSPERIODE,
    REVURDERING,
    ANNULLERT_PERIODE,
    UFULLSTENDIG,
}
