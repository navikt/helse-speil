import { Arbeidsgiver, GhostPeriode, Overstyring, Periode } from '@io/graphql';
import { enGenerasjon } from '@test-data/generasjon';
import { enGhostPeriode } from '@test-data/periode';

type Extensions = {
    medPerioder(perioder: Array<Periode>): Arbeidsgiver & Extensions;
    medGhostPerioder(ghostPerioder: Array<GhostPeriode>): Arbeidsgiver & Extensions;
    medOverstyringer(overstyringer: Array<Overstyring>): Arbeidsgiver & Extensions;
    medOrganisasjonsnummer(organisasjonsnummer: string): Arbeidsgiver & Extensions;
};

export const enArbeidsgiver: OverridableConstructor<Arbeidsgiver, Extensions> = (overrides) => ({
    navn: 'Sjokkerende Elektriker',
    organisasjonsnummer: '987654321',
    arbeidsforhold: [],
    bransjer: [],
    generasjoner: [enGenerasjon()],
    ghostPerioder: [enGhostPeriode()],
    overstyringer: [],
    inntekterFraAordningen: [],
    ...overrides,
    medPerioder(perioder: Array<Periode>) {
        this.generasjoner = [enGenerasjon({ perioder })];
        return this;
    },
    medGhostPerioder(ghostPerioder: Array<GhostPeriode>) {
        this.ghostPerioder = ghostPerioder;
        return this;
    },
    medOverstyringer(overstyringer: Array<Overstyring>) {
        this.overstyringer = overstyringer;
        return this;
    },
    medOrganisasjonsnummer(organisasjonsnummer: string) {
        this.organisasjonsnummer = organisasjonsnummer;
        return this;
    },
});
