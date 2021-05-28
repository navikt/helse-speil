import { Dayjs } from 'dayjs';
import {
    Arbeidsgiver,
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Utbetalingstype,
    Vedtaksperiode as FullstendigVedtaksperiode,
} from 'internal-types';
import { nanoid } from 'nanoid';

import { PeriodeBuilder } from '../routes/saksbilde/tidslinje/periodeBuilder';
import { usePerson } from '../state/person';

type Vedtaksperiode = FullstendigVedtaksperiode | UfullstendigVedtaksperiode;

const isUfullstendig = (vedtaksperiode: Vedtaksperiode) => {
    return (
        (vedtaksperiode as UfullstendigVedtaksperiode) !== undefined &&
        (vedtaksperiode as FullstendigVedtaksperiode) === undefined
    );
};

const useHistorikkelement = (beregningId: string) => {
    const element = usePerson()
        ?.arbeidsgivere.flatMap((arb: Arbeidsgiver) => arb.utbetalingshistorikk)
        .find((element: UtbetalingshistorikkElement) => element.id === beregningId);
    if (!element) throw Error('Fant ikke element i utbetalingshistorikk');
    return element;
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

export const utbetaling = (element: UtbetalingshistorikkElement): UtbetalingshistorikkUtbetaling2 => element.utbetaling;

export const erUtbetaling = (utbetaling: UtbetalingshistorikkUtbetaling2) =>
    utbetaling.type === Utbetalingstype.UTBETALING;

export const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const erTidslinjeperiode = (obj: any): obj is Tidslinjeperiode =>
    (obj as Tidslinjeperiode).beregningId !== undefined;

export const erRevurderingsperiode = (periode: Tidslinjeperiode) => periode.type === Periodetype.REVURDERING;

export const useMaksdato = (beregningId: string) => utbetaling(useHistorikkelement(beregningId)).maksdato;

export const useNettobeløp = (beregningId: string) => utbetaling(useHistorikkelement(beregningId)).nettobeløp;

export const useGjenståendeDager = (beregningId: string) =>
    utbetaling(useHistorikkelement(beregningId)).gjenståendeDager;

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
}
