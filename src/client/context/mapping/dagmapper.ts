import { SpleisSykdomsdag, SpleisSykdomsdagtype, SpleisUtbetalingsdag, Utbetalingsdagtype } from './external.types';
import { Dagtype, Kildetype, Sykdomsdag, Utbetalingsdag } from '../types';
import { somDato } from './vedtaksperiodemapper';

const utbetalingstidslinjedag = (dag: Utbetalingsdagtype): Dagtype => {
    switch (dag) {
        case Utbetalingsdagtype.ARBEIDSGIVERPERIODE:
            return 'Arbeidsgiverperiode' as Dagtype;
        case Utbetalingsdagtype.NAVDAG:
            return Dagtype.Syk;
        case Utbetalingsdagtype.NAVHELG:
            return Dagtype.Helg;
        case Utbetalingsdagtype.FRIDAG:
            return Dagtype.Ferie;
        case Utbetalingsdagtype.UKJENTDAG:
            return Dagtype.Ubestemt;
        case Utbetalingsdagtype.ARBEIDSDAG:
            return Dagtype.Arbeidsdag;
        case Utbetalingsdagtype.AVVISTDAG:
            return Dagtype.Avvist;
        case Utbetalingsdagtype.FORELDETDAG:
            return Dagtype.Foreldet;
    }
};

const sykdomstidslinjedag = (dag: SpleisSykdomsdagtype): Dagtype => {
    switch (dag) {
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
            return Dagtype.Syk;
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
        case SpleisSykdomsdagtype.PERMISJONSDAG_AAREG:
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
            return Dagtype.Ferie;
        case SpleisSykdomsdagtype.UTENLANDSDAG:
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.STUDIEDAG:
            return Dagtype.Ubestemt;
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return Dagtype.Arbeidsdag;
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
            return Dagtype.Helg;
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
            return Dagtype.Egenmelding;
    }
};

const hendelseType = (type: SpleisSykdomsdagtype): Kildetype | undefined => {
    switch (type) {
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
            return Kildetype.Inntektsmelding;
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.STUDIEDAG:
        case SpleisSykdomsdagtype.UTENLANDSDAG:
            return Kildetype.Søknad;
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
            return Kildetype.Sykmelding;
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG_AAREG:
            return undefined;
    }
};

export const tilSykdomstidslinje = (sykdomstidslinje: SpleisSykdomsdag[]): Sykdomsdag[] =>
    sykdomstidslinje.map(dag => ({
        type: sykdomstidslinjedag(dag.type as SpleisSykdomsdagtype),
        dato: somDato(dag.dagen),
        gradering: dag.grad,
        kilde: hendelseType(dag.type as SpleisSykdomsdagtype)
    }));

export const tilUtbetalingstidslinje = (utbetalingstidslinje: SpleisUtbetalingsdag[]): Utbetalingsdag[] =>
    utbetalingstidslinje.map(dag => ({
        type: utbetalingstidslinjedag(dag.type as Utbetalingsdagtype),
        dato: somDato(dag.dato),
        gradering: dag.grad,
        utbetaling: dag.utbetaling
    }));
