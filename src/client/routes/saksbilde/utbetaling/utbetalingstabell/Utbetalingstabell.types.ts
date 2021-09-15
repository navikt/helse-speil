import { Dayjs } from 'dayjs';
import { Dagtype, Kildetype, Utbetalingsdag } from 'internal-types';

export type Dagoverstyring = {
    begrunnelse: string;
    navn: string;
    timestamp: Dayjs;
    ident?: string;
};

export type UtbetalingstabellDag = Utbetalingsdag & {
    dagerIgjen?: number;
    overstyring?: Dagoverstyring;
    sykdomsdag: {
        type: Dagtype;
        kilde: Kildetype;
    };
};
