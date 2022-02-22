export type UtbetalingstabellDag = Utbetalingsdag & {
    isMaksdato: boolean;
    sykdomsdag: {
        type: Sykdomsdag['type'];
        kilde: Sykdomsdag['kilde'];
        grad: Sykdomsdag['gradering'];
    };
    overstyringer?: Dagoverstyring[];
    dagerIgjen?: number;
};
