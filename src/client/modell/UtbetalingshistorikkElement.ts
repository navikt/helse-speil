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

export interface UtbetalingshistorikkElement {
    id: string;
    perioder: Tidslinjeperiode[];
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: UtbetalingshistorikkUtbetaling2[];
    kilde: string;
}

export const utbetalingshistorikkelement = (
    id: string,
    beregnettidslinje: Sykdomsdag[],
    hendelsetidslinje: Sykdomsdag[],
    utbetalinger: UtbetalingshistorikkUtbetaling2[],
    vedtaksperioder: Vedtaksperiode[],
    organisasjonsnummer: string
): UtbetalingshistorikkElement => {
    const sisteUtbetaling = utbetalinger[utbetalinger.length - 1];
    const erUtbetaling = sisteUtbetaling.type === Utbetalingstype.UTBETALING;

    return {
        id: id,
        perioder: erUtbetaling
            ? tidslinjevedtaksperioder(id, vedtaksperioder, organisasjonsnummer, sisteUtbetaling)
            : revurderingsperioder(id, beregnettidslinje, organisasjonsnummer, sisteUtbetaling),
        beregnettidslinje: beregnettidslinje,
        hendelsetidslinje: hendelsetidslinje,
        utbetalinger: utbetalinger,
        kilde: sisteUtbetaling.type,
    };
};

export const sisteUtbetaling = (element: UtbetalingshistorikkElement): UtbetalingshistorikkUtbetaling2 =>
    element.utbetalinger[element.utbetalinger.length - 1];

export const erUtbetaling = (utbetaling: UtbetalingshistorikkUtbetaling2) =>
    utbetaling.type === Utbetalingstype.UTBETALING;

const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

const tidslinjevedtaksperioder = (
    beregningsId: string,
    vedtaksperioder: Vedtaksperiode[],
    organisasjonsnummer: string,
    utbetaling?: UtbetalingshistorikkUtbetaling2
): Tidslinjeperiode[] => {
    return vedtaksperioder
        .filter((it) => isUfullstendig(it) || beregningsId === it.beregningIder?.[0])
        .map((it) => {
            return {
                id: it.id,
                beregningId: beregningsId,
                fom: it.fom,
                tom: it.tom,
                type: Periodetype.VEDTAKSPERIODE,
                tilstand: utbetaling?.status ?? Utbetalingstatus.INGEN_UTBETALING,
                utbetalingstidslinje: utbetaling ? utbetalingstidslinje(utbetaling, it.fom, it.tom) : [],
                sykdomstidslinje: it.sykdomstidslinje ?? [],
                organisasjonsnummer: organisasjonsnummer,
            };
        });
};

const revurderingsperioder = (
    beregningsId: string,
    beregnetTidslinje: Sykdomsdag[],
    organisasjonsnummer: string,
    utbetaling?: UtbetalingshistorikkUtbetaling2
): Tidslinjeperiode[] => {
    if (!utbetaling) return [];
    const perioder = new PeriodeBuilder().build(
        beregnetTidslinje.filter((it) => it.dato.isSameOrAfter(utbetaling?.utbetalingstidslinje[0].dato))
    );
    return perioder.map((it) => {
        return {
            id: nanoid(),
            beregningId: beregningsId,
            fom: it.fom,
            tom: it.tom,
            tilstand: utbetaling.status ?? Utbetalingstatus.INGEN_UTBETALING,
            utbetalingstidslinje: utbetaling ? utbetalingstidslinje(utbetaling, it.fom, it.tom) : [],
            sykdomstidslinje: sykdomstidslinje(beregnetTidslinje, it.fom, it.tom),
            type: Periodetype.REVURDERING,
            organisasjonsnummer: organisasjonsnummer,
        };
    });
};

export const erTidslinjeperiode = (obj: any): obj is Tidslinjeperiode =>
    (obj as Tidslinjeperiode).beregningId !== undefined;

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

export const useMaksdato = (beregningId: string) => sisteUtbetaling(useHistorikkelement(beregningId)).maksdato;

export const useNettobeløp = (beregningId: string) => sisteUtbetaling(useHistorikkelement(beregningId)).nettobeløp;

export const useGjenståendeDager = (beregningId: string) =>
    sisteUtbetaling(useHistorikkelement(beregningId)).gjenståendeDager;

export interface Tidslinjeperiode {
    id: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Utbetalingstatus;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
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
