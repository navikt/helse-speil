import { nanoid } from 'nanoid';

import { Generasjon } from '@io/graphql';
import { enBeregnetPeriode } from '@test-data/periode';

export const enGenerasjon: OverridableConstructor<Generasjon> = (overrides) => ({
    __typename: 'Generasjon',
    id: nanoid(),
    perioder: [enBeregnetPeriode()],
    ...overrides,
});
