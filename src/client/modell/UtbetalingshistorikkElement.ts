import {
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Vedtaksperiode as FullstendigVedtaksperiode,
} from 'internal-types';
import { Dayjs } from 'dayjs';
import { PeriodeBuilder } from '../components/tidslinje/periodeBuilder';
import { nanoid } from 'nanoid';

type Vedtaksperiode = FullstendigVedtaksperiode | UfullstendigVedtaksperiode;

export class UtbetalingshistorikkElement {
    id: string;
    perioder: Tidslinjeperiode[];
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: UtbetalingshistorikkUtbetaling2[];
    kilde: string;

    constructor(
        id: string,
        beregnettidslinje: Sykdomsdag[],
        hendelsetidslinje: Sykdomsdag[],
        utbetalinger: UtbetalingshistorikkUtbetaling2[],
        vedtaksperioder: Vedtaksperiode[]
    ) {
        this.id = id;
        this.beregnettidslinje = beregnettidslinje;
        this.hendelsetidslinje = hendelsetidslinje;
        this.utbetalinger = utbetalinger;
        this.kilde = this.gjeldendeUtbetaling().type;
        this.perioder = this.opprettPerioder(vedtaksperioder);
    }

    private gjeldendeUtbetaling = () => this.utbetalinger[this.utbetalinger.length - 1];
    private utbetalingstidslinje = (fom: Dayjs, tom: Dayjs) =>
        this.gjeldendeUtbetaling().utbetalingstidslinje.filter(
            ({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato)
        );

    erUtbetaling = () => this.kilde === 'UTBETALING';

    private opprettPerioder = (vedtaksperioder: Vedtaksperiode[]) => {
        return this.erUtbetaling() ? this.vedtaksperioder(vedtaksperioder) : this.revurderingsperioder();
    };

    private utbetalingstatus = (): Utbetalingstatus => {
        if (!this.gjeldendeUtbetaling()) return Utbetalingstatus.INGEN_UTBETALING;
        switch (this.gjeldendeUtbetaling().status) {
            case 'IKKE_UTBETALT':
                return Utbetalingstatus.IKKE_UTBETALT;
            case 'UTBETALT':
                return Utbetalingstatus.UTBETALT;
            default:
                return Utbetalingstatus.UKJENT;
        }
    };

    private vedtaksperioder = (vedtaksperioder: Vedtaksperiode[]) => {
        return vedtaksperioder
            .filter((it) => this.isUfullstendig(it) || this.id === it.beregningIder?.[0])
            .map((it) =>
                Tidslinjeperiode.nyVedtaksperiode(
                    it.id,
                    this.id,
                    it.fom,
                    it.tom,
                    this.utbetalingstatus(),
                    this.utbetalingstidslinje(it.fom, it.tom)
                )
            );
    };

    private revurderingsperioder = () => {
        const perioder = new PeriodeBuilder().build(
            this.beregnettidslinje.filter((it) =>
                it.dato.isSameOrAfter(this.gjeldendeUtbetaling().utbetalingstidslinje[0].dato)
            )
        );
        return perioder.map((it) =>
            Tidslinjeperiode.nyRevurderingsperiode(
                this.id,
                it.fom,
                it.tom,
                this.utbetalingstatus(),
                this.utbetalingstidslinje(it.fom, it.tom)
            )
        );
    };

    private isUfullstendig = (vedtaksperiode: Vedtaksperiode) => {
        return (
            (vedtaksperiode as UfullstendigVedtaksperiode) !== undefined &&
            (vedtaksperiode as FullstendigVedtaksperiode) === undefined
        );
    };
}

export class Tidslinjeperiode {
    id: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Utbetalingstatus;
    utbetalingstidslinje: Utbetalingsdag[];

    private constructor(
        id: string,
        beregningId: string,
        fom: Dayjs,
        tom: Dayjs,
        type: Periodetype,
        tilstand: Utbetalingstatus,
        utbetalingstidslinje: Utbetalingsdag[]
    ) {
        this.id = id;
        this.beregningId = beregningId;
        this.fom = fom;
        this.tom = tom;
        this.type = type;
        this.tilstand = tilstand;
        this.utbetalingstidslinje = utbetalingstidslinje;
    }

    extend = (tom: Dayjs): void => {
        this.tom = tom;
    };

    static nyVedtaksperiode = (
        id: string,
        beregningId: string,
        fom: Dayjs,
        tom: Dayjs,
        tilstand: Utbetalingstatus,
        utbetalingstidslinje: Utbetalingsdag[]
    ) => new Tidslinjeperiode(id, beregningId, fom, tom, Periodetype.VEDTAKSPERIODE, tilstand, utbetalingstidslinje);

    static nyRevurderingsperiode = (
        beregningId: string,
        fom: Dayjs,
        tom: Dayjs,
        utbetalingstatus: Utbetalingstatus,
        utbetalingstidslinje: Utbetalingsdag[]
    ) =>
        new Tidslinjeperiode(
            nanoid(),
            beregningId,
            fom,
            tom,
            Periodetype.REVURDERING,
            utbetalingstatus,
            utbetalingstidslinje
        );
}

export enum Utbetalingstatus {
    IKKE_UTBETALT,
    UTBETALT,
    INGEN_UTBETALING,
    UKJENT,
}

enum Periodetype {
    VEDTAKSPERIODE,
    REVURDERING,
}
