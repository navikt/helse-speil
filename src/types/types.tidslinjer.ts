import { Dayjs } from 'dayjs';
import { SpleisSykdomsdagkilde, SpleisSykdomsdagtype, SpleisUtbetalingsdag } from 'external-types';
import {
    Dagtype,
    Kildetype,
    Sykdomsdag,
    Utbetalingsdag,
    UtbetalingshistorikkArbeidsgiverOppdrag,
    UtbetalingshistorikkUtbetaling,
} from 'internal-types';

// External
export interface EksternUtbetalingshistorikkElement {
    beregnettidslinje: EksternSykdomsdag[];
    hendelsetidslinje: EksternSykdomsdag[];
    utbetalinger: EksternUtbetaling[];
}

export interface EksternSykdomsdag {
    dagen: string;
    type: SpleisSykdomsdagtype;
    kilde?: SpleisSykdomsdagkilde;
    grad?: number;
}

export interface EksternUtbetaling {
    status: string;
    utbetalingstidslinje: SpleisUtbetalingsdag[];
}

// Internal
export interface UtbetalingshistorikkElement {
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: Utbetaling[];
}

export interface Utbetaling {
    status: string;
    utbetalingstidslinje: Utbetalingsdag[];
}
