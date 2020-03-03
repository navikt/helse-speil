import { Dagtype, Kildelabel, Utbetalingsdagtype, Vedtaksperiode } from '../types';
import { Dagtype as Tabelldag } from '@navikt/helse-frontend-tabell';

const utbetalingstidslinjedag = (dag: Utbetalingsdagtype) => {
    switch (dag) {
        case Utbetalingsdagtype.ARBEIDSGIVERPERIODE:
            return 'Arbeidsgiverperiode' as Tabelldag;
        case Utbetalingsdagtype.NAVDAG:
            return Tabelldag.Syk;
        case Utbetalingsdagtype.NAVHELG:
            return Tabelldag.Helg;
        case Utbetalingsdagtype.FRIDAG:
            return Tabelldag.Ferie;
        case Utbetalingsdagtype.UKJENTDAG:
        case Utbetalingsdagtype.AVVISTDAG:
            return Tabelldag.Ubestemt;
        case Utbetalingsdagtype.ARBEIDSDAG:
            return Tabelldag.Arbeidsdag;
    }
};

const sykdomstidslinjedag = (dag: Dagtype): Tabelldag => {
    switch (dag) {
        case Dagtype.SYKEDAG_SØKNAD:
        case Dagtype.SYKEDAG_SYKMELDING:
            return Tabelldag.Syk;
        case Dagtype.PERMISJONSDAG_SØKNAD:
        case Dagtype.PERMISJONSDAG_AAREG:
        case Dagtype.FERIEDAG_INNTEKTSMELDING:
        case Dagtype.FERIEDAG_SØKNAD:
            return Tabelldag.Ferie;
        case Dagtype.UTENLANDSDAG:
        case Dagtype.UBESTEMTDAG:
        case Dagtype.STUDIEDAG:
            return Tabelldag.Ubestemt;
        case Dagtype.IMPLISITT_DAG:
        case Dagtype.ARBEIDSDAG_SØKNAD:
        case Dagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return Tabelldag.Arbeidsdag;
        case Dagtype.SYK_HELGEDAG_SYKMELDING:
        case Dagtype.SYK_HELGEDAG_SØKNAD:
            return Tabelldag.Helg;
        case Dagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case Dagtype.EGENMELDINGSDAG_SØKNAD:
            return Tabelldag.Egenmelding;
    }
};

const hendelseType = (type: Dagtype) => {
    switch (type) {
        case Dagtype.ARBEIDSDAG_INNTEKTSMELDING:
        case Dagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case Dagtype.FERIEDAG_INNTEKTSMELDING:
            return 'IM';
        case Dagtype.ARBEIDSDAG_SØKNAD:
        case Dagtype.EGENMELDINGSDAG_SØKNAD:
        case Dagtype.FERIEDAG_SØKNAD:
        case Dagtype.PERMISJONSDAG_SØKNAD:
        case Dagtype.SYKEDAG_SØKNAD:
        case Dagtype.SYK_HELGEDAG_SØKNAD:
        case Dagtype.STUDIEDAG:
        case Dagtype.UTENLANDSDAG:
            return 'SØ';
        case Dagtype.SYK_HELGEDAG_SYKMELDING:
        case Dagtype.SYKEDAG_SYKMELDING:
            return 'SM';
        case Dagtype.UBESTEMTDAG:
        case Dagtype.IMPLISITT_DAG:
        case Dagtype.PERMISJONSDAG_AAREG:
            return undefined;
    }
};

export const sykdomstidslinje = (vedtaksperiode?: Vedtaksperiode) =>
    vedtaksperiode?.sykdomstidslinje.map((dag, index) => ({
        type: sykdomstidslinjedag(dag.type as Dagtype),
        dato: dag.dagen,
        gradering: 100,
        kilde: hendelseType(dag.type as Dagtype)
            ? { label: hendelseType(dag.type as Dagtype) as Kildelabel, link: '' }
            : undefined
    })) ?? [];

export const utbetalingstidslinje = (vedtaksperiode?: Vedtaksperiode) =>
    vedtaksperiode?.utbetalingstidslinje.map((dag, index) => ({
        type: utbetalingstidslinjedag(dag.type as Utbetalingsdagtype),
        dato: dag.dato,
        gradering: 100,
        utbetaling: dag.utbetaling
    })) ?? [];
