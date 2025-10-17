import { enBeregnetPeriode } from '@test-data/periode';
import { TestGenerasjon } from '@test-data/person-query-types';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enGenerasjon: OverridableConstructor<TestGenerasjon> = (overrides) => ({
    __typename: 'Generasjon',
    id: generateId(),
    perioder: [enBeregnetPeriode()],
    ...overrides,
});
