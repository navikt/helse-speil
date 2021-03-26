import {
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Utbetalingstype,
    Vedtaksperiode as FullstendigVedtaksperiode,
} from 'internal-types';
import { Dayjs } from 'dayjs';
import { PeriodeBuilder } from '../components/tidslinje/periodeBuilder';
import { nanoid } from 'nanoid';

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
    vedtaksperioder: Vedtaksperiode[]
): UtbetalingshistorikkElement => {
    const sisteUtbetaling = utbetalinger[utbetalinger.length - 1];
    const erUtbetaling = sisteUtbetaling.type === Utbetalingstype.UTBETALING;

    return {
        id: id,
        perioder: erUtbetaling
            ? tidslinjevedtaksperioder(id, vedtaksperioder, sisteUtbetaling)
            : revurderingsperioder(id, beregnettidslinje, sisteUtbetaling),
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

const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

const tidslinjevedtaksperioder = (
    beregningsId: string,
    vedtaksperioder: Vedtaksperiode[],
    utbetaling?: UtbetalingshistorikkUtbetaling2
) => {
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
            };
        });
};

const revurderingsperioder = (
    beregningsId: string,
    beregnetTidslinje: Sykdomsdag[],
    utbetaling?: UtbetalingshistorikkUtbetaling2
) => {
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
            type: Periodetype.REVURDERING,
        };
    });
};

const isUfullstendig = (vedtaksperiode: Vedtaksperiode) => {
    return (
        (vedtaksperiode as UfullstendigVedtaksperiode) !== undefined &&
        (vedtaksperiode as FullstendigVedtaksperiode) === undefined
    );
};

export interface Tidslinjeperiode {
    id: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Utbetalingstatus;
    utbetalingstidslinje: Utbetalingsdag[];
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
