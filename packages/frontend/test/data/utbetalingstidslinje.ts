const utbetalingsdagtype = (sykdomsdagtype: ExternalSykdomsdagtype): ExternalUtbetalingsdagtype => {
    switch (sykdomsdagtype) {
        case 'ARBEIDSDAG':
        case 'IMPLISITT_DAG':
        case 'ARBEIDSDAG_SØKNAD':
        case 'ARBEIDSDAG_INNTEKTSMELDING':
            return 'Arbeidsdag';
        case 'UTENLANDSDAG':
        case 'ARBEIDSGIVERDAG':
        case 'EGENMELDINGSDAG_SØKNAD':
        case 'EGENMELDINGSDAG_INNTEKTSMELDING':
            return 'ArbeidsgiverperiodeDag';
        case 'FERIEDAG':
        case 'FERIEDAG_SØKNAD':
        case 'FERIEDAG_INNTEKTSMELDING':
        case 'PERMISJONSDAG':
        case 'PERMISJONSDAG_SØKNAD':
            return 'Feriedag';
        case 'FORELDET_SYKEDAG':
            return 'AvvistDag';
        case 'SYK_HELGEDAG':
        case 'FRISK_HELGEDAG':
        case 'SYK_HELGEDAG_SØKNAD':
        case 'FRISK_HELGEDAG_SØKNAD':
        case 'SYK_HELGEDAG_SYKMELDING':
        case 'FRISK_HELGEDAG_INNTEKTSMELDING':
            return 'Helgedag';
        case 'STUDIEDAG':
        case 'UBESTEMTDAG':
        case 'ANNULLERT_DAG':
            return 'UkjentDag';
        case 'SYKEDAG':
        case 'SYKEDAG_SØKNAD':
        case 'SYKEDAG_SYKMELDING':
            return 'NavDag';
    }
};

const utbetaling = (sykdomsdagtype: ExternalSykdomsdagtype, dagsats: number): number | undefined =>
    utbetalingsdagtype(sykdomsdagtype) === 'NavDag' ? dagsats : undefined;

const tilUtbetalingsdag = (
    sykdomsdag: ExternalSykdomsdag,
    dagsats: number,
    grad: number = 100
): ExternalUtbetalingsdag => ({
    type: utbetalingsdagtype(sykdomsdag.type),
    inntekt: dagsats,
    dato: sykdomsdag.dagen,
    utbetaling: utbetaling(sykdomsdag.type, dagsats),
    grad: grad,
});

export const utbetalingstidslinje = (
    sykdomstidslinje: ExternalSykdomsdag[],
    dagsats: number
): ExternalUtbetalingsdag[] => sykdomstidslinje.map((sykdomsdag) => tilUtbetalingsdag(sykdomsdag, dagsats));
