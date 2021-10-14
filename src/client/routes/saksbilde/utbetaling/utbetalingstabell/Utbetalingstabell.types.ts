export type UtbetalingstabellDag = Utbetalingsdag & {
    isMaksdato: boolean;
    sykdomsdag: {
        type: Sykdomsdag['type'];
        kilde: Sykdomsdag['kilde'];
    };
    overstyringer?: Dagoverstyring[];
    dagerIgjen?: number;
    alderPåDagen?: number;
};
