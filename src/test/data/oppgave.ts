import { OppgaveForPeriodevisning } from '@io/graphql';
import { ApiEgenskap, ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enOppgaveForOversikten: OverridableConstructor<ApiOppgaveProjeksjon> = (overrides) => ({
    id: generateId(),
    personPseudoId: '5fc87a14-1720-4c26-a26d-588da529af8a',
    aktorId: 'en-aktør',
    navn: {
        fornavn: 'Fornavn',
        mellomnavn: null,
        etternavn: 'Etternavn',
    },
    egenskaper: [
        ApiEgenskap.FORSTEGANGSBEHANDLING,
        ApiEgenskap.SOKNAD,
        ApiEgenskap.UTBETALING_TIL_SYKMELDT,
        ApiEgenskap.EN_ARBEIDSGIVER,
    ],
    tildeling: null,
    opprettetTidspunkt: '2020-01-01',
    behandlingOpprettetTidspunkt: '2020-01-01',
    paVentInfo: null,
    ...overrides,
});

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    __typename: 'OppgaveForPeriodevisning',
    id: generateId(),
    ...overrides,
});
