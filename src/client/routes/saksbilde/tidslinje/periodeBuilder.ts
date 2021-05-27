import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Dagtype, Sykdomsdag } from 'internal-types';

dayjs.extend(isSameOrAfter);

export class Periode {
    fom: Dayjs;
    tom: Dayjs;

    constructor(fom: Dayjs) {
        this.fom = fom;
        this.tom = fom;
    }

    extend = (tom: Dayjs) => {
        this.tom = tom;
    };
}

export interface PerioderTilstand {
    sykedag: (builder: PeriodeBuilder, dagen: Dayjs) => void;
    ukjentDag: (builder: PeriodeBuilder, dagen: Dayjs) => void;
    entering: (builder: PeriodeBuilder, dagen: dayjs.Dayjs) => void;
    leaving: (builder: PeriodeBuilder, dagen: Dayjs) => void;
}

export class PeriodeBuilder {
    tilstand: PerioderTilstand = new UtenforPeriode();
    perioder: Periode[] = [];

    byttTilstand = (nyTilstand: PerioderTilstand, dagen: Dayjs) => {
        this.tilstand.leaving(this, dagen);
        this.tilstand = nyTilstand;
        this.tilstand.entering(this, dagen);
    };

    add = (periode: Periode) => this.perioder.push(periode);

    build = (sykdomstidslinje: Sykdomsdag[]): Periode[] => {
        sykdomstidslinje.forEach(({ dato, type }, index) => {
            switch (type) {
                case Dagtype.Ubestemt:
                    this.tilstand.ukjentDag(this, dato);
                    break;
                default:
                    this.tilstand.sykedag(this, dato);
                    break;
            }
            if (sykdomstidslinje.length - 1 === index) {
                this.byttTilstand(new UtenforPeriode(), dato);
                return;
            }
        });
        return this.perioder;
    };
}

class Revurderingsperiode implements PerioderTilstand {
    periode: Periode;

    entering = (builder: PeriodeBuilder, dagen: Dayjs): void => {
        this.periode = new Periode(dagen);
    };
    leaving = (builder: PeriodeBuilder, dagen: Dayjs): void => {
        builder.add(this.periode);
    };
    sykedag = (builder: PeriodeBuilder, dagen: Dayjs): void => this.periode.extend(dagen);
    ukjentDag = (builder: PeriodeBuilder, dagen: Dayjs): void => builder.byttTilstand(new UtenforPeriode(), dagen);
}

class UtenforPeriode implements PerioderTilstand {
    entering = (builder: PeriodeBuilder, dagen: Dayjs): void => {};
    leaving = (builder: PeriodeBuilder, dagen: Dayjs): void => {};
    sykedag = (builder: PeriodeBuilder, dagen: Dayjs): void => builder.byttTilstand(new Revurderingsperiode(), dagen);
    ukjentDag = (builder: PeriodeBuilder, dagen: Dayjs): void => {};
}
