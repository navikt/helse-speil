import { InternTidslinje } from '../../../types/types.tidslinjer';
import { Sykepengeperiode, Vedtaksperiodetilstand } from '@navikt/helse-frontend-tidslinje';
import { Dagtype, Person } from 'internal-types';
import { useMemo } from 'react';

export interface PerioderTilstand {
    sykedag: (builder: PerioderBuilder, dagen: Date) => void;
    ukjentDag: (builder: PerioderBuilder, dagen: Date) => void;
    entering: (builder: PerioderBuilder, dagen: Date) => void;
    leaving: (builder: PerioderBuilder, dagen: Date) => void;
}

export class Periode {
    fom: Date;
    tom: Date;

    extend = (tom: Date): void => {
        this.tom = tom;
    };

    erTilRevurdering = (dato: Date): boolean => this.senereEnn(dato) || this.overlapperMed(dato);

    private senereEnn = (dato: Date): boolean => dato <= this.fom;

    private overlapperMed = (dato: Date): boolean => dato <= this.tom && this.fom <= dato;

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

    build = (tidslinje: InternTidslinje): Periode[] => {
        tidslinje.sykdomstidslinje.forEach((dag, index) => {
            switch (dag.type) {
                case Dagtype.Ubestemt:
                    this.tilstand.ukjentDag(this, dag.dato.toDate());
                    break;
                default:
                    this.tilstand.sykedag(this, dag.dato.toDate());
                    break;
            }
            if (tidslinje.sykdomstidslinje.length - 1 === index) {
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
}

class NyPeriode implements PerioderTilstand {
    periode: Periode;

    entering = (builder: PerioderBuilder, dagen: Date) => (this.periode = new Periode(dagen));
    leaving = (builder: PerioderBuilder, dagen: Date) => builder.add(this.periode);
    sykedag = (builder: PerioderBuilder, dagen: Date) => this.periode.extend(dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new UtenforPeriode(), dagen);
}

class UtenforPeriode implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => builder.byttTilstand(new NyPeriode(), dagen);
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => {};
}

class Ferdig implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Date) => {};
    leaving = (builder: PerioderBuilder, dagen: Date) => {};
    sykedag = (builder: PerioderBuilder, dagen: Date) => {};
    ukjentDag = (builder: PerioderBuilder, dagen: Date) => {};
}

export const toSykepengeperiode = (tidslinje: InternTidslinje): Sykepengeperiode[] => {
    const perioder: Periode[] = new PerioderBuilder().build(tidslinje);
    return perioder.map((periode, index) => ({
        id: index.toString(),
        fom: periode.fom,
        tom: periode.tom,
        status: periode.erTilRevurdering(tidslinje.hendelseTidslinje[0].dato.toDate())
            ? Vedtaksperiodetilstand.Oppgaver
            : Vedtaksperiodetilstand.Ukjent,
    }));
};

export const useRevurderingsrader = (person?: Person): Sykepengeperiode[][] =>
    useMemo(
        () =>
            person?.arbeidsgivere.map((arbeidsgiver) => {
                if (!arbeidsgiver.tidslinjer) {
                    return [];
                } else {
                    const first: InternTidslinje = arbeidsgiver.tidslinjer[0]!!;
                    return toSykepengeperiode(first);
                }
            }) ?? [],
        [person]
    );
