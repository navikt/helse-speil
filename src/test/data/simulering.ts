import { Simulering, Simuleringsdetaljer, Simuleringsperiode, Simuleringsutbetaling } from '@io/graphql';
import { OverridableConstructor } from '@typer/shared';

export const enSimuleringsdetalj: OverridableConstructor<Simuleringsdetaljer> = (overrides) => ({
    __typename: 'Simuleringsdetaljer',
    fom: '2023-01-01',
    tom: '2023-01-31',
    antallSats: 31,
    belop: 12500,
    klassekode: 'SPREFAG-IOP',
    klassekodebeskrivelse: 'Sykepenger, refusjon arbeidsgiver',
    konto: '1234567890',
    refunderesOrgNr: '987654321',
    sats: 1000,
    tilbakeforing: false,
    typeSats: 'DAG',
    uforegrad: 100,
    utbetalingstype: 'YTEL',
    ...overrides,
});

export const enSimuleringsutbetaling: OverridableConstructor<Simuleringsutbetaling> = (overrides) => ({
    __typename: 'Simuleringsutbetaling',
    mottakerId: '987654321',
    mottakerNavn: 'EN ARBEIDSGIVER AS',
    forfall: '2023-02-01',
    feilkonto: false,
    detaljer: [enSimuleringsdetalj()],
    ...overrides,
});

export const enSimuleringsperiode: OverridableConstructor<Simuleringsperiode> = (overrides) => ({
    __typename: 'Simuleringsperiode',
    fom: '2023-01-01',
    tom: '2023-01-31',
    utbetalinger: [enSimuleringsutbetaling()],
    ...overrides,
});

export const enSimulering: OverridableConstructor<Simulering> = (overrides) => ({
    __typename: 'Simulering',
    fagsystemId: 'en-fagsystemid',
    totalbelop: 15000,
    tidsstempel: '2023-02-01T12:00:00',
    utbetalingslinjer: [],
    perioder: [enSimuleringsperiode()],
    ...overrides,
});
