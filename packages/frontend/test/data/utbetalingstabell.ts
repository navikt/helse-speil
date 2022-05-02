import { Kildetype } from '@io/graphql';

export const getUtbetalingstabellDag = (overrides?: Partial<UtbetalingstabellDag>): UtbetalingstabellDag => ({
    dato: '2022-01-01',
    kilde: { id: '123', type: Kildetype.Inntektsmelding },
    type: 'Syk',
    erAGP: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});
