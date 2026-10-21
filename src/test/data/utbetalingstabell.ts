import { ApiKildetype } from '@io/rest/generated/spesialist.schemas';
import { Sykedag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

export const getUtbetalingstabellDag = (overrides?: Partial<Utbetalingstabelldag>): Utbetalingstabelldag => ({
    dato: '2022-01-01',
    kilde: { id: '123', type: ApiKildetype.INNTEKTSMELDING },
    dag: Sykedag,
    erAGP: false,
    erVentetid: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});
