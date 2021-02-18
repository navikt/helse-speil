import dayjs from 'dayjs';
import { Dagtype } from 'internal-types';
import { CollapsedUtbetalingshistorikkElement } from './useTidslinjerader';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export interface PerioderTilstand {
    sykedag: (builder: PerioderBuilder, dagen: Date) => void;
    ukjentDag: (builder: PerioderBuilder, dagen: Date) => void;
    entering: (builder: PerioderBuilder, dagen: Date) => void;
    leaving: (builder: PerioderBuilder, dagen: Date) => void;
    vedtaksperiodeDag: (builder: PerioderBuilder, dagen: Date) => void;
}

export class Periode {
    fom: Date;
    tom: Date;

    extend = (tom: Date): void => {
        this.tom = tom;
    };

    constructor(fom: Date) {
        this.fom = fom;
        this.tom = fom;
    }
}

export class PerioderBuilder {
    tilstand: PerioderTilstand = new Start();
    perioder: Periode[] = [];

    byttTilstand = (nyTilstand: PerioderTilstand, dagen: Date) => {
        this.tilstand.leaving(this, dagen);
        this.tilstand = nyTilstand;
        this.tilstand.entering(this, dagen);
    };

    add = (periode: Periode) => this.perioder.push(periode);

    build = (
        element: CollapsedUtbetalingshistorikkElement,
        vedtaksperioder: { start: Date; end: Date }[]
    ): Periode[] => {
        element.beregnettidslinje.forEach((dag, index) => {
            if (
                vedtaksperioder.some(
                    ({ start, end }) => dayjs(start).isSameOrBefore(dag.dato) && dayjs(end).isSameOrAfter(dag.dato)
                )
            ) {
                this.tilstand.vedtaksperiodeDag(this, dag.dato.toDate());
                return;
            }
            switch (dag.type) {
                case Dagtype.Ubestemt:
                    this.tilstand.ukjentDag(this, dag.dato.toDate());
                    break;
                default:
                    this.tilstand.sykedag(this, dag.dato.toDate());
                    break;
            }
            if (element.beregnettidslinje.length - 1 === index) {
                this.byttTilstand(new Ferdig(), dag.dato.toDate());
                return;
            }
        });
        return this.perioder;
    };
}

class Start implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new NyPeriode(), dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new UtenforPeriode(), dagen);
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Date) =>
        builder.byttTilstand(new VedtaksperiodeTilstand(), dagen);
}

class VedtaksperiodeTilstand implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new NyPeriode(), dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new UtenforPeriode(), dagen);
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Date) => {};
}

class NyPeriode implements PerioderTilstand {
    periode: Periode;

    entering = (builder: PerioderBuilder, dagen: Date) => (this.periode = new Periode(dagen));
    leaving = (builder: PerioderBuilder, dagen: Date) => builder.add(this.periode);
    sykedag = (builder: PerioderBuilder, dagen: Date) => this.periode.extend(dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new UtenforPeriode(), dagen);
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Date) =>
        builder.byttTilstand(new VedtaksperiodeTilstand(), dagen);
}

class UtenforPeriode implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new NyPeriode(), dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => {};
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Date) =>
        builder.byttTilstand(new VedtaksperiodeTilstand(), dagen);
}

class Ferdig implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => {};
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => {};
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Date) => {};
}
