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
    boenhet: {
        id: '1234',
        navn: 'Et sted',
    },
    antallVarsler: 0,
    erBeslutter: false,
    erRetur: false,
    flereArbeidsgivere: false,
    trengerTotrinnsvurdering: false,
    type: Oppgavetype.Soknad,
    vedtaksperiodeId: nanoid(),
    ...overrides,
});

export const enOppgave: OverridableConstructor<OppgaveForPeriodevisning> = (overrides) => ({
    id: nanoid(),
    erBeslutter: false,
    erRetur: false,
    trengerTotrinnsvurdering: false,
    ...overrides,
});
