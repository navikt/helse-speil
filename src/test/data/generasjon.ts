import { nanoid } from 'nanoid';

import { enBeregnetPeriode } from '@test-data/periode';
import { TestGenerasjon } from '@test-data/person-query-types';
import { OverridableConstructor } from '@typer/shared';

export const enGenerasjon: OverridableConstructor<TestGenerasjon> = (overrides) => ({
    __typename: 'Generasjon',
    id: nanoid(),
    perioder: [enBeregnetPeriode()],
    ...overrides,
});
