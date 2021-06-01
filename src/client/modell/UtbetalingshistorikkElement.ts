import { Dayjs } from 'dayjs';
import {
    Arbeidsgiver,
    Sykdomsdag,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Utbetalingstype,
} from 'internal-types';

import { usePerson } from '../state/person';

const useHistorikkelement = (beregningId?: string) => {
    return usePerson()
        ?.arbeidsgivere.flatMap((arb: Arbeidsgiver) => arb.utbetalingshistorikk)
        .find((element: UtbetalingshistorikkElement) => element.id === beregningId);
};

export interface UtbetalingshistorikkElement {
    id: string;
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetaling: UtbetalingshistorikkUtbetaling2;
    kilde: string;
}

export const utbetalingshistorikkelement = (
    id: string,
    beregnettidslinje: Sykdomsdag[],
    hendelsetidslinje: Sykdomsdag[],
    utbetaling: UtbetalingshistorikkUtbetaling2
): UtbetalingshistorikkElement => {
    const erUtbetaling = utbetaling.type === Utbetalingstype.UTBETALING;

    return {
        id: id,
        beregnettidslinje: beregnettidslinje,
        hendelsetidslinje: hendelsetidslinje,
        utbetaling: utbetaling,
        kilde: utbetaling.type,
    };
};

export const useSisteUtbetaling = (beregningId?: string): UtbetalingshistorikkUtbetaling2 | undefined => {
    const element = useHistorikkelement(beregningId);
    if (!element) return undefined;
    return element.utbetaling;
};

export const erUtbetaling = (utbetaling: UtbetalingshistorikkUtbetaling2) =>
    utbetaling.type === Utbetalingstype.UTBETALING;

export const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const erRevurderingsperiode = (periode: Tidslinjeperiode) => periode.type === Periodetype.REVURDERING;

export const useMaksdato = (beregningId: string) => {
    return useSisteUtbetaling(beregningId)?.maksdato;
};

export const useNettobeløp = (beregningId: string) => {
    return useSisteUtbetaling(beregningId)?.nettobeløp;
};

export const useGjenståendeDager = (beregningId: string) => {
    return useSisteUtbetaling(beregningId)?.gjenståendeDager;
};

export interface Tidslinjeperiode {
    id: string;
    unique: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Utbetalingstatus;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    fullstendig: boolean;
}

export enum Utbetalingstatus {
    IKKE_UTBETALT,
    UTBETALT,
    INGEN_UTBETALING,
    UKJENT,
}

export enum Periodetype {
    VEDTAKSPERIODE,
    REVURDERING,
    UFULLSTENDIG,
}
