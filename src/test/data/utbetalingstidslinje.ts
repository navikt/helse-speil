import { SpleisSykdomsdag, SpleisSykdomsdagtype, SpleisUtbetalingsdag, SpleisUtbetalingsdagtype } from 'external-types';

const utbetalingsdagtype = (sykdomsdagtype: SpleisSykdomsdagtype): SpleisUtbetalingsdagtype => {
    switch (sykdomsdagtype) {
        case SpleisSykdomsdagtype.ARBEIDSDAG:
        case SpleisSykdomsdagtype.IMPLISITT_DAG:
        case SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD:
        case SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return SpleisUtbetalingsdagtype.ARBEIDSDAG;
        case SpleisSykdomsdagtype.UTENLANDSDAG:
        case SpleisSykdomsdagtype.ARBEIDSGIVERDAG:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_SØKNAD:
        case SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
            return SpleisUtbetalingsdagtype.ARBEIDSGIVERPERIODE;
        case SpleisSykdomsdagtype.FERIEDAG:
        case SpleisSykdomsdagtype.FERIEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FERIEDAG_INNTEKTSMELDING:
            return SpleisUtbetalingsdagtype.FERIEDAG;
        case SpleisSykdomsdagtype.FORELDET_SYKEDAG:
            return SpleisUtbetalingsdagtype.AVVISTDAG;
        case SpleisSykdomsdagtype.SYK_HELGEDAG:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYK_HELGEDAG_SYKMELDING:
        case SpleisSykdomsdagtype.FRISK_HELGEDAG_INNTEKTSMELDING:
            return SpleisUtbetalingsdagtype.HELGEDAG;
        case SpleisSykdomsdagtype.STUDIEDAG:
        case SpleisSykdomsdagtype.UBESTEMTDAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG:
        case SpleisSykdomsdagtype.PERMISJONSDAG_AAREG:
        case SpleisSykdomsdagtype.PERMISJONSDAG_SØKNAD:
            return SpleisUtbetalingsdagtype.UKJENTDAG;
        case SpleisSykdomsdagtype.SYKEDAG:
        case SpleisSykdomsdagtype.SYKEDAG_SØKNAD:
        case SpleisSykdomsdagtype.SYKEDAG_SYKMELDING:
            return SpleisUtbetalingsdagtype.NAVDAG;
    }
};

const utbetaling = (sykdomsdagtype: SpleisSykdomsdagtype, dagsats: number): number | undefined =>
    utbetalingsdagtype(sykdomsdagtype) === SpleisUtbetalingsdagtype.NAVDAG ? dagsats : undefined;

const tilUtbetalingsdag = (
    sykdomsdag: SpleisSykdomsdag,
    dagsats: number,
    grad: number = 100
): SpleisUtbetalingsdag => ({
    type: utbetalingsdagtype(sykdomsdag.type),
    inntekt: dagsats,
    dato: sykdomsdag.dagen,
    utbetaling: utbetaling(sykdomsdag.type, dagsats),
    grad: grad,
});

export const utbetalingstidslinje = (sykdomstidslinje: SpleisSykdomsdag[], dagsats: number): SpleisUtbetalingsdag[] =>
    sykdomstidslinje.map((sykdomsdag) => tilUtbetalingsdag(sykdomsdag, dagsats));
