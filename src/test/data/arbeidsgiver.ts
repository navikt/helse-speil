import { OverridableConstructor } from '@/types/shared';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriode,
    GhostPeriodeFragment,
    Overstyring,
    OverstyringFragment,
    Periode,
} from '@io/graphql';
import { enGenerasjon } from '@test-data/generasjon';
import { enGhostPeriode } from '@test-data/periode';

type Extensions = {
    medPerioder(perioder: Array<BeregnetPeriodeFragment>): ArbeidsgiverFragment & Extensions;
    medGhostPerioder(ghostPerioder: Array<GhostPeriodeFragment>): ArbeidsgiverFragment & Extensions;
    medOverstyringer(overstyringer: Array<Overstyring>): ArbeidsgiverFragment & Extensions;
    medOrganisasjonsnummer(organisasjonsnummer: string): ArbeidsgiverFragment & Extensions;
};

export const enArbeidsgiver: OverridableConstructor<ArbeidsgiverFragment, Extensions> = (overrides) => ({
    __typename: 'Arbeidsgiver',
    navn: 'Sjokkerende Elektriker',
    organisasjonsnummer: '987654321',
    arbeidsforhold: [],
    bransjer: [],
    generasjoner: [enGenerasjon()],
    ghostPerioder: [enGhostPeriode()],
    overstyringer: [],
    inntekterFraAordningen: [],
    ...overrides,
    medPerioder(perioder: Array<BeregnetPeriodeFragment>) {
        this.generasjoner = [enGenerasjon({ perioder })];
        return this;
    },
    medGhostPerioder(ghostPerioder: Array<GhostPeriodeFragment>) {
        this.ghostPerioder = ghostPerioder;
        return this;
    },
    medOverstyringer(overstyringer: Array<OverstyringFragment>) {
        this.overstyringer = overstyringer;
        return this;
    },
    medOrganisasjonsnummer(organisasjonsnummer: string) {
        this.organisasjonsnummer = organisasjonsnummer;
        return this;
    },
});
