import { nanoid } from 'nanoid';

import { OverridableConstructor } from '@/types/shared';
import {
    AntallArbeidsforhold,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveForPeriodevisning,
    OppgaveTilBehandling,
    Oppgavetype,
    Periodetype,
} from '@io/graphql';

export const enOppgaveForOversikten: OverridableConstructor<OppgaveTilBehandling> = (overrides) => ({
    __typename: 'OppgaveTilBehandling',
    id: nanoid(),
    vedtaksperiodeId: nanoid(),
    aktorId: 'en-aktør',
    opprettet: '2020-01-01',
    opprinneligSoknadsdato: '2020-01-01',
    navn: {
        __typename: 'Personnavn',
        etternavn: 'Etternavn',
        mellomnavn: null,
        fornavn: 'Fornavn',
    },
    antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
    oppgavetype: Oppgavetype.Soknad,
    periodetype: Periodetype.Forstegangsbehandling,
    mottaker: Mottaker.Arbeidsgiver,
    tidsfrist: null,
    tildeling: null,
    egenskaper: [
        { __typename: 'Oppgaveegenskap', kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
        { __typename: 'Oppgaveegenskap', kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
        { __typename: 'Oppgaveegenskap', kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt },
        { __typename: 'Oppgaveegenskap', kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
    ],
    ...overrides,
});

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    __typename: 'OppgaveForPeriodevisning',
    id: nanoid(),
    ...overrides,
});
