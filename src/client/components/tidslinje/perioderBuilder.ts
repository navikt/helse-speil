import dayjs, { Dayjs } from 'dayjs';
import { Dagtype, Sykdomsdag } from 'internal-types';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Tidslinjeperiode, Utbetalingstatus } from '../../modell/UtbetalingshistorikkElement';
dayjs.extend(isSameOrAfter);

export interface PerioderTilstand {
    sykedag: (builder: PerioderBuilder, dagen: Dayjs) => void;
    ukjentDag: (builder: PerioderBuilder, dagen: Dayjs) => void;
    entering: (builder: PerioderBuilder, dagen: dayjs.Dayjs) => void;
    leaving: (builder: PerioderBuilder, dagen: Dayjs) => void;
}

export class PerioderBuilder {
    id: string;
    utbetalingstatus: Utbetalingstatus;
    constructor(id: string, utbetalingstatus: Utbetalingstatus) {
        this.id = id;
        this.tilstand = new UtenforPeriode();
        this.utbetalingstatus = utbetalingstatus;
    }

    tilstand: PerioderTilstand;
    perioder: Tidslinjeperiode[] = [];

    byttTilstand = (nyTilstand: PerioderTilstand, dagen: Dayjs) => {
        this.tilstand.leaving(this, dagen);
        this.tilstand = nyTilstand;
        this.tilstand.entering(this, dagen);
    };

    add = (periode: Tidslinjeperiode) => this.perioder.push(periode);

    build = (sykdomstidslinje: Sykdomsdag[]): Tidslinjeperiode[] => {
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
    periode: Tidslinjeperiode;

    entering = (builder: PerioderBuilder, dagen: Dayjs): void => {
        this.periode = Tidslinjeperiode.nyRevurderingsperiode(builder.id, dagen, builder.utbetalingstatus);
    };
    leaving = (builder: PerioderBuilder, dagen: Dayjs): void => {
        builder.add(this.periode);
    };
    sykedag = (builder: PerioderBuilder, dagen: Dayjs): void => this.periode.extend(dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Dayjs): void => builder.byttTilstand(new UtenforPeriode(), dagen);
}

class UtenforPeriode implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    leaving = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    sykedag = (builder: PerioderBuilder, dagen: Dayjs): void => builder.byttTilstand(new Revurderingsperiode(), dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Dayjs): void => {};
}
