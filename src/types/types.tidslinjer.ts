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
export interface Tidslinje {
    sykdomstidslinje: EksternSykdomsdag[];
    hendelseTidslinje: EksternSykdomsdag[];
    utbetaling?: EksternUtbetaling;
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
export interface InternTidslinje {
    sykdomstidslinje: Sykdomsdag[];
    hendelseTidslinje: Sykdomsdag[];
    utbetaling?: InternUtbetaling;
}

export interface InternUtbetaling {
    status: string;
    utbetalingstidslinje: Utbetalingsdag[];
}
