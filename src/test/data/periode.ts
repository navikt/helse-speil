import { nanoid } from 'nanoid';

import {
    Dag,
    GhostPeriode,
    Inntektstype,
    Kildetype,
    OppgaveForPeriodevisning,
    Periodetilstand,
    Periodetype,
    Sykdomsdagtype,
    UberegnetPeriode,
    Utbetaling,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { enOppgave } from '@test-data/oppgave';
import { enUtbetaling } from '@test-data/utbetaling';

export const enDag: OverridableConstructor<Dag> = (overrides) => ({
    dato: '2020-01-01',
    grad: 100,
    kilde: {
        id: nanoid(),
        type: Kildetype.Soknad,
    },
    sykdomsdagtype: Sykdomsdagtype.Sykedag,
    utbetalingsdagtype: Utbetalingsdagtype.Navdag,
    utbetalingsinfo: {
        arbeidsgiverbelop: 1000,
        inntekt: 1000,
        refusjonsbelop: 1000,
        totalGrad: 100,
        utbetaling: 1000,
    },
    ...overrides,
});

type Extensions = {
    medUtbetaling(utbetaling: Utbetaling): FetchedBeregnetPeriode & Extensions;
    medSkjæringstidspunkt(skjæringstidspunkt: string): FetchedBeregnetPeriode & Extensions;
    medOppgave(oppgave?: OppgaveForPeriodevisning): FetchedBeregnetPeriode & Extensions;
    somErForkastet(): FetchedBeregnetPeriode & Extensions;
    somErTilGodkjenning(): FetchedBeregnetPeriode & Extensions;
    somErTilRevurdering(): FetchedBeregnetPeriode & Extensions;
};

export const enBeregnetPeriode: OverridableConstructor<FetchedBeregnetPeriode, Extensions> = (overrides) => ({
    __typename: 'BeregnetPeriode',
    id: nanoid(),
    behandlingId: nanoid(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [enDag()],
    opprettet: '2020-01-01',
    aktivitetslogg: [],
    beregningId: nanoid(),
    erForkastet: false,
    forbrukteSykedager: 0,
    gjenstaendeSykedager: 200,
    handlinger: [],
    hendelser: [],
    inntektstype: Inntektstype.Enarbeidsgiver,
    maksdato: '2020-12-30',
    notater: [],
    periodehistorikk: [],
    periodetilstand: Periodetilstand.Utbetalt,
    periodetype: Periodetype.Forstegangsbehandling,
    periodevilkar: {
        alder: {
            alderSisteSykedag: 30,
            oppfylt: true,
        },
        sykepengedager: {
            forbrukteSykedager: 0,
            gjenstaendeSykedager: 200,
            maksdato: '2020-12-30',
            oppfylt: true,
            skjaeringstidspunkt: '2020-01-01',
        },
    },
    utbetaling: enUtbetaling(),
    varsler: [],
    vedtaksperiodeId: nanoid(),
    vilkarsgrunnlagId: nanoid(),
    ...overrides,
    medUtbetaling(utbetaling: Utbetaling) {
        this.utbetaling = utbetaling;
        return this;
    },
    medSkjæringstidspunkt(skjæringstidspunkt: string) {
        this.skjaeringstidspunkt = skjæringstidspunkt;
        return this;
    },
    medOppgave(oppgave: OppgaveForPeriodevisning = enOppgave()) {
        this.oppgave = oppgave;
        return this;
    },
    somErForkastet() {
        this.utbetaling = this.utbetaling ?? enUtbetaling();
        this.utbetaling.status = Utbetalingstatus.Forkastet;
        this.erForkastet = true;
        return this;
    },
    somErTilGodkjenning() {
        this.periodetilstand = Periodetilstand.TilGodkjenning;
        return this;
    },
    somErTilRevurdering() {
        this.periodetilstand = Periodetilstand.TilGodkjenning;
        this.utbetaling = this.utbetaling ?? enUtbetaling();
        this.utbetaling.type = Utbetalingtype.Revurdering;
        return this;
    },
    egenskaper: [],
    avslag: [],
});

export const enUberegnetPeriode: OverridableConstructor<UberegnetPeriode> = (overrides) => ({
    __typename: 'UberegnetPeriode',
    behandlingId: nanoid(),
    erForkastet: false,
    fom: '2020-01-01',
    hendelser: [],
    id: nanoid(),
    inntektstype: Inntektstype.Enarbeidsgiver,
    notater: [],
    opprettet: '2020-01-01',
    periodetilstand: Periodetilstand.Utbetalt,
    periodetype: Periodetype.Forstegangsbehandling,
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [enDag()],
    tom: '2020-01-30',
    varsler: [],
    vedtaksperiodeId: nanoid(),
    aktivitetslogg: [],
    ...overrides,
});

export const enGhostPeriode: OverridableConstructor<GhostPeriode> = (overrides) => ({
    __typename: 'GhostPeriode',
    id: nanoid(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    deaktivert: false,
    organisasjonsnummer: '987654321',
    skjaeringstidspunkt: '2020-01-01',
    vilkarsgrunnlagId: nanoid(),
    ...overrides,
});
