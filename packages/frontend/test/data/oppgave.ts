import { nanoid } from 'nanoid';

import { OppgaveForPeriodevisning } from '@io/graphql';

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    id: nanoid(),
    erBeslutter: false,
    erRetur: false,
    trengerTotrinnsvurdering: false,
    ...overrides,
});
