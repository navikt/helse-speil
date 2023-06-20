import { nanoid } from 'nanoid';

import {
    Adressebeskyttelse,
    Kjonn,
    OppgaveForOversiktsvisning,
    OppgaveForPeriodevisning,
    Oppgavetype,
} from '@io/graphql';

export const enOppgaveForOversikten: OverridableConstructor<OppgaveForOversiktsvisning> = (overrides) => ({
    id: nanoid(),
    opprettet: '2020-01-01',
    fodselsnummer: '12345678910',
    aktorId: 'en-aktør',
    personinfo: {
        adressebeskyttelse: Adressebeskyttelse.Ugradert,
        etternavn: 'Etternavn',
        fornavn: 'Fornavn',
        kjonn: Kjonn.Mann,
    },
    navn: {
        etternavn: 'Etternavn',
        fornavn: 'Fornavn',
    },
    boenhet: {
        id: '1234',
        navn: 'Et sted',
    },
    flereArbeidsgivere: false,
    type: Oppgavetype.Soknad,
    opprinneligSoknadsdato: '2020-01-01',
    vedtaksperiodeId: nanoid(),
    totrinnsvurdering: null,
    ...overrides,
});

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    id: nanoid(),
    totrinnsvurdering: null,
    ...overrides,
});
