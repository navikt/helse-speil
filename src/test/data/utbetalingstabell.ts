import { Kildetype } from '@io/graphql';

import { Sykedag } from '../../routes/saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

export const getUtbetalingstabellDag = (overrides?: Partial<Utbetalingstabelldag>): Utbetalingstabelldag => ({
    dato: '2022-01-01',
    kilde: { __typename: 'Kilde', id: '123', type: Kildetype.Inntektsmelding },
    dag: Sykedag,
    erAGP: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});
