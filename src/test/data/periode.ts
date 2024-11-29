import { nanoid } from 'nanoid';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Inntektstype,
    Kildetype,
    NyttInntektsforholdPeriode,
    OppgaveForPeriodevisning,
    Periodetilstand,
    Periodetype,
    Sykdomsdagtype,
    UberegnetPeriodeFragment,
    Utbetaling,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { enOppgave } from '@test-data/oppgave';
import { TestDag } from '@test-data/person-query-types';
import { enUtbetaling } from '@test-data/utbetaling';
import { OverridableConstructor } from '@typer/shared';

export const enDag: OverridableConstructor<TestDag> = (overrides) => ({
    __typename: 'Dag',
    dato: '2020-01-01',
    grad: 100,
    kilde: {
        __typename: 'Kilde',
        id: nanoid(),
        type: Kildetype.Soknad,
    },
    sykdomsdagtype: Sykdomsdagtype.Sykedag,
    utbetalingsdagtype: Utbetalingsdagtype.Navdag,
    begrunnelser: null,
    utbetalingsinfo: {
        __typename: 'Utbetalingsinfo',
        personbelop: null,
        arbeidsgiverbelop: 1000,
        inntekt: 1000,
        refusjonsbelop: 1000,
        totalGrad: 100,
        utbetaling: 1000,
    },
    ...overrides,
});

type Extensions = {
    medUtbetaling(utbetaling: Utbetaling): BeregnetPeriodeFragment & Extensions;
    medSkjæringstidspunkt(skjæringstidspunkt: string): BeregnetPeriodeFragment & Extensions;
    medOppgave(oppgave?: OppgaveForPeriodevisning): BeregnetPeriodeFragment & Extensions;
    somErForkastet(): BeregnetPeriodeFragment & Extensions;
    somErTilGodkjenning(): BeregnetPeriodeFragment & Extensions;
    somErTilRevurdering(): BeregnetPeriodeFragment & Extensions;
};

export const enBeregnetPeriode: OverridableConstructor<BeregnetPeriodeFragment, Extensions> = (overrides) => ({
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
    oppgave: null,
    totrinnsvurdering: null,
    paVent: null,
    risikovurdering: null,
    inntektstype: Inntektstype.Enarbeidsgiver,
    maksdato: '2020-12-30',
    notater: [],
    historikkinnslag: [],
    periodetilstand: Periodetilstand.Utbetalt,
    periodetype: Periodetype.Forstegangsbehandling,
    periodevilkar: {
        __typename: 'Periodevilkar',
        alder: {
            __typename: 'Alder',
            alderSisteSykedag: 30,
            oppfylt: true,
        },
        sykepengedager: {
            __typename: 'Sykepengedager',
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
    avslag: [],
    vedtakBegrunnelser: [],
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
    annullering: null,
});

export const enUberegnetPeriode: OverridableConstructor<UberegnetPeriodeFragment> = (overrides) => ({
    __typename: 'UberegnetPeriode',
    behandlingId: nanoid(),
    erForkastet: false,
    fom: '2020-01-01',
    hendelser: [],
    id: nanoid(),
    inntektstype: Inntektstype.Enarbeidsgiver,
    notater: [],
    opprettet: '2020-01-01',
    periodetilstand: Periodetilstand.IngenUtbetaling,
    periodetype: Periodetype.Forstegangsbehandling,
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [enDag()],
    tom: '2020-01-30',
    varsler: [],
    vedtaksperiodeId: nanoid(),
    aktivitetslogg: [],
    ...overrides,
});

export const enGhostPeriode: OverridableConstructor<GhostPeriodeFragment> = (overrides) => ({
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

export const enNyttInntektsforholdPeriode: OverridableConstructor<NyttInntektsforholdPeriode> = (overrides) => ({
    __typename: 'NyttInntektsforholdPeriode',
    id: nanoid(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    organisasjonsnummer: '987654321',
    skjaeringstidspunkt: '2020-01-01',
    vilkarsgrunnlagId: nanoid(),
    dagligBelop: 100.0,
    manedligBelop: 3000.0,
    ...overrides,
});
