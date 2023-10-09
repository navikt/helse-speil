import { nanoid } from 'nanoid';

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
    id: nanoid(),
    vedtaksperiodeId: nanoid(),
    aktorId: 'en-aktør',
    opprettet: '2020-01-01',
    opprinneligSoknadsdato: '2020-01-01',
    navn: {
        etternavn: 'Etternavn',
        fornavn: 'Fornavn',
    },
    antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
    oppgavetype: Oppgavetype.Soknad,
    periodetype: Periodetype.Forstegangsbehandling,
    mottaker: Mottaker.Arbeidsgiver,
    egenskaper: [
        { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
        { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
        { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt },
        { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
    ],
    ...overrides,
});

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    id: nanoid(),
    totrinnsvurdering: null,
    kanAvvises: true,
    ...overrides,
});
