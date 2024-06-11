import { nanoid } from 'nanoid';

import { OverridableConstructor } from '@/types/shared';
import { enBeregnetPeriode } from '@test-data/periode';
import { TestGenerasjon } from '@test-data/person-query-types';

export const enGenerasjon: OverridableConstructor<TestGenerasjon> = (overrides) => ({
    __typename: 'Generasjon',
    id: nanoid(),
    perioder: [enBeregnetPeriode()],
    ...overrides,
});
