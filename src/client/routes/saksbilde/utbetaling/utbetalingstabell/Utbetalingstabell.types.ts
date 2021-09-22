import { Dayjs } from 'dayjs';

export type Dagoverstyring = {
    begrunnelse: string;
    navn: string;
    timestamp: Dayjs;
    ident?: string;
};

export type UtbetalingstabellDag = Utbetalingsdag & {
    isMaksdato: boolean;
    sykdomsdag: {
        type: Sykdomsdag['type'];
        kilde: Sykdomsdag['kilde'];
    };
    overstyringer?: Dagoverstyring[];
    dagerIgjen?: number;
};
