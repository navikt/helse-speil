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
    beregningId: string;
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
    type: string;
    utbetalingstidslinje: SpleisUtbetalingsdag[];
}

// Internal
export interface UtbetalingshistorikkElement {
    id: string;
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: Utbetaling[];
}

export interface Utbetaling {
    status: string;
    type: string;
    utbetalingstidslinje: Utbetalingsdag[];
}
