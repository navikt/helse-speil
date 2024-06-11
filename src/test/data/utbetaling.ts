import { nanoid } from 'nanoid';

import { Utbetaling, Utbetalingstatus, Utbetalingtype, Vurdering } from '@io/graphql';

export const enVurdering: OverridableConstructor<Vurdering> = (overrides) => ({
    __typename: 'Vurdering',
    automatisk: false,
    godkjent: true,
    ident: 'N123456',
    tidsstempel: '2020-01-01',
    ...overrides,
});

export const enUtbetaling: OverridableConstructor<Utbetaling> = (overrides) => ({
    __typename: 'Utbetaling',
    id: nanoid(),
    arbeidsgiverFagsystemId: 'en-arbeidsgivers-fagsystemid',
    arbeidsgiverNettoBelop: 30000,
    personFagsystemId: 'en-persons-fagsystemid',
    personNettoBelop: 0,
    status: Utbetalingstatus.Utbetalt,
    type: Utbetalingtype.Utbetaling,
    vurdering: enVurdering(),
    ...overrides,
});
