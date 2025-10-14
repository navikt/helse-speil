import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Overstyring,
    OverstyringFragment,
} from '@io/graphql';
import { enGenerasjon } from '@test-data/generasjon';
import { enGhostPeriode } from '@test-data/periode';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medPerioder(perioder: Array<BeregnetPeriodeFragment>): ArbeidsgiverFragment & Extensions;
    medGhostPerioder(ghostPerioder: Array<GhostPeriodeFragment>): ArbeidsgiverFragment & Extensions;
    medOverstyringer(overstyringer: Array<Overstyring>): ArbeidsgiverFragment & Extensions;
    medOrganisasjonsnummer(organisasjonsnummer: string): ArbeidsgiverFragment & Extensions;
};

function genererTilfeldigSiffer() {
    return Math.floor(Math.random() * 10);
}

function genererOrganisasjonsnummer(): string {
    let value: string = '';
    for (let i = 0; i < 9; i++) {
        value = value + genererTilfeldigSiffer().toString();
    }
    return value;
}

export const enArbeidsgiver: OverridableConstructor<ArbeidsgiverFragment, Extensions> = (overrides) => ({
    __typename: 'Arbeidsgiver',
    navn: 'Sjokkerende Elektriker',
    organisasjonsnummer: genererOrganisasjonsnummer(),
    arbeidsforhold: [],
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
