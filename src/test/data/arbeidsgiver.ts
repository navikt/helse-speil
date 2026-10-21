import {
    ApiArbeidsgiver,
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiOverstyring,
} from '@io/rest/generated/spesialist.schemas';
import { enBehandling } from '@test-data/behandling';
import { enGhostPeriode } from '@test-data/periode';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medPerioder(perioder: ApiBeregnetPeriode[]): ApiArbeidsgiver & Extensions;
    medGhostPerioder(ghostPerioder: ApiGhostPeriode[]): ApiArbeidsgiver & Extensions;
    medOverstyringer(overstyringer: ApiOverstyring[]): ApiArbeidsgiver & Extensions;
    medOrganisasjonsnummer(organisasjonsnummer: string): ApiArbeidsgiver & Extensions;
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

export const enArbeidsgiver: OverridableConstructor<ApiArbeidsgiver, Extensions> = (overrides) => ({
    navn: 'Sjokkerende Elektriker',
    organisasjonsnummer: genererOrganisasjonsnummer(),
    arbeidsforhold: [],
    behandlinger: [enBehandling()],
    ghostPerioder: [enGhostPeriode()],
    overstyringer: [],
    inntekterFraAordningen: [],
    ...overrides,
    medPerioder(perioder: ApiBeregnetPeriode[]) {
        this.behandlinger = [enBehandling({ perioder })];
        return this;
    },
    medGhostPerioder(ghostPerioder: ApiGhostPeriode[]) {
        this.ghostPerioder = ghostPerioder;
        return this;
    },
    medOverstyringer(overstyringer: ApiOverstyring[]) {
        this.overstyringer = overstyringer;
        return this;
    },
    medOrganisasjonsnummer(organisasjonsnummer: string) {
        this.organisasjonsnummer = organisasjonsnummer;
        return this;
    },
});
