import { enBeregnetPeriode } from '@test-data/periode';
import { TestBehandling } from '@test-data/person-query-types';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enBehandling: OverridableConstructor<TestBehandling> = (overrides) => ({
    __typename: 'Behandling',
    id: generateId(),
    perioder: [enBeregnetPeriode()],
    ...overrides,
});
