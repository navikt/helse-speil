import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Overstyring,
    OverstyringFragment,
} from '@io/graphql';
import { enBehandling } from '@test-data/behandling';
import { enGhostPeriode } from '@test-data/periode';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medPerioder(perioder: BeregnetPeriodeFragment[]): ArbeidsgiverFragment & Extensions;
    medGhostPerioder(ghostPerioder: GhostPeriodeFragment[]): ArbeidsgiverFragment & Extensions;
    medOverstyringer(overstyringer: Overstyring[]): ArbeidsgiverFragment & Extensions;
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
    behandlinger: [enBehandling()],
    ghostPerioder: [enGhostPeriode()],
    overstyringer: [],
    inntekterFraAordningen: [],
    ...overrides,
    medPerioder(perioder: BeregnetPeriodeFragment[]) {
        this.behandlinger = [enBehandling({ perioder })];
        return this;
    },
    medGhostPerioder(ghostPerioder: GhostPeriodeFragment[]) {
        this.ghostPerioder = ghostPerioder;
        return this;
    },
    medOverstyringer(overstyringer: OverstyringFragment[]) {
        this.overstyringer = overstyringer;
        return this;
    },
    medOrganisasjonsnummer(organisasjonsnummer: string) {
        this.organisasjonsnummer = organisasjonsnummer;
        return this;
    },
});
