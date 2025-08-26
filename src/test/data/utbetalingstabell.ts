import { Kildetype } from '@io/graphql';
import { Sykedag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

export const getUtbetalingstabellDag = (overrides?: Partial<Utbetalingstabelldag>): Utbetalingstabelldag => ({
    dato: '2022-01-01',
    kilde: { __typename: 'Kilde', id: '123', type: Kildetype.Inntektsmelding },
    dag: Sykedag,
    erAGP: false,
    erVentetid: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});
