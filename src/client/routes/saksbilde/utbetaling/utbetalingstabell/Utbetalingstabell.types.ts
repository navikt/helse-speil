import { Dayjs } from 'dayjs';
import { Dagtype, Kildetype, Utbetalingsdag } from 'internal-types';

export type Dagoverstyring = {
    begrunnelse: string;
    navn: string;
    timestamp: Dayjs;
    ident?: string;
};

export type UtbetalingstabellDag = Utbetalingsdag & {
    isMaksdato: boolean;
    sykdomsdag: {
        type: Dagtype;
        kilde: Kildetype;
    };
    dagerIgjen?: number;
    overstyring?: Dagoverstyring;
};
