import {
    ApiUtbetaling,
    ApiUtbetalingstatus,
    ApiUtbetalingtype,
    ApiVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enVurdering: OverridableConstructor<ApiVurdering> = (overrides) => ({
    automatisk: false,
    godkjent: true,
    ident: 'N123456',
    tidsstempel: '2020-01-01',
    ...overrides,
});

export const enUtbetaling: OverridableConstructor<ApiUtbetaling> = (overrides) => ({
    id: generateId(),
    arbeidsgiverFagsystemId: 'en-arbeidsgivers-fagsystemid',
    arbeidsgiverNettoBelop: 30000,
    personFagsystemId: 'en-persons-fagsystemid',
    personNettoBelop: 0,
    status: ApiUtbetalingstatus.UTBETALT,
    type: ApiUtbetalingtype.UTBETALING,
    vurdering: enVurdering(),
    arbeidsgiversimulering: null,
    personsimulering: null,
    ...overrides,
});
