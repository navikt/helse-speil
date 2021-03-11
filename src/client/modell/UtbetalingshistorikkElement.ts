import { Sykdomsdag, UfullstendigVedtaksperiode, Vedtaksperiode as FullstendigVedtaksperiode } from 'internal-types';
import { Utbetaling } from '../../types/types.tidslinjer';
import { Dayjs } from 'dayjs';
import { PerioderBuilder } from '../components/tidslinje/perioderBuilder';
import { nanoid } from 'nanoid';

type Vedtaksperiode = FullstendigVedtaksperiode | UfullstendigVedtaksperiode;

export class UtbetalingshistorikkElement {
    id: string;
    perioder: Tidslinjeperiode[];
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: Utbetaling[];
    kilde: string;

    constructor(
        id: string,
        beregnettidslinje: Sykdomsdag[],
        hendelsetidslinje: Sykdomsdag[],
        utbetalinger: Utbetaling[],
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

    private erUtbetaling = () => this.kilde === 'UTBETALING';

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
            .map((it) => Tidslinjeperiode.nyVedtaksperiode(it.id, this.id, it.fom, it.tom, this.utbetalingstatus()));
    };

    private revurderingsperioder = () =>
        new PerioderBuilder(this.id, this.utbetalingstatus()).build(
            this.beregnettidslinje.filter((it) =>
                it.dato.isSameOrAfter(this.gjeldendeUtbetaling().utbetalingstidslinje[0].dato)
            )
        );

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

    private constructor(
        id: string,
        beregningId: string,
        startdato: Dayjs,
        type: Periodetype,
        tilstand: Utbetalingstatus
    ) {
        this.id = id;
        this.beregningId = beregningId;
        this.fom = startdato;
        this.tom = startdato;
        this.type = type;
        this.tilstand = tilstand;
    }

    extend = (tom: Dayjs): void => {
        this.tom = tom;
    };

    static nyVedtaksperiode = (id: string, beregningId: string, fom: Dayjs, tom: Dayjs, tilstand: Utbetalingstatus) => {
        const periode = new Tidslinjeperiode(id, beregningId, fom, Periodetype.VEDTAKSPERIODE, tilstand);
        periode.extend(tom);
        return periode;
    };

    static nyRevurderingsperiode = (beregningId: string, fom: Dayjs, utbetalingstatus: Utbetalingstatus) =>
        new Tidslinjeperiode(nanoid(), beregningId, fom, Periodetype.REVURDERING, utbetalingstatus);
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
