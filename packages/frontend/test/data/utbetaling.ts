import { nanoid } from 'nanoid';

import { Utbetaling, Utbetalingstatus, Utbetalingtype } from '@io/graphql';

export const enUtbetaling: OverridableConstructor<Utbetaling> = (overrides) => ({
    id: nanoid(),
    arbeidsgiverFagsystemId: 'en-arbeidsgivers-fagsystemid',
    arbeidsgiverNettoBelop: 30000,
    personFagsystemId: 'en-persons-fagsystemid',
    personNettoBelop: 0,
    status: Utbetalingstatus.Utbetalt,
    type: Utbetalingtype.Utbetaling,
    ...overrides,
});
