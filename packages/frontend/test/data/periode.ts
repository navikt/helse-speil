import { nanoid } from 'nanoid';

import { GhostPeriode, Inntektstype, Periodetilstand, Periodetype, Utbetaling } from '@io/graphql';
import { enUtbetaling } from '@test-data/utbetaling';

type Extensions = {
    medUtbetaling(utbetaling: Utbetaling): FetchedBeregnetPeriode;
    medSkjæringstidspunkt(skjæringstidspunkt: string): FetchedBeregnetPeriode;
};

export const enBeregnetPeriode: OverridableConstructor<FetchedBeregnetPeriode, Extensions> = (overrides) => ({
    id: nanoid(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [],
    opprettet: '2020-01-01',
    aktivitetslogg: [],
    beregningId: nanoid(),
    erForkastet: false,
    forbrukteSykedager: 0,
    gjenstaendeSykedager: 200,
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
        soknadsfrist: {
            oppfylt: true,
            sendtNav: '2020-01-01',
            soknadFom: '2020-01-01',
            soknadTom: '2020-01-30',
        },
        sykepengedager: {
            forbrukteSykedager: 0,
            gjenstaendeSykedager: 200,
            maksdato: '2020-12-30',
            oppfylt: true,
            skjaeringstidspunkt: '2020-01-01',
        },
    },
    trengerTotrinnsvurdering: false,
    utbetaling: enUtbetaling(),
    varsler: [],
    vedtaksperiodeId: nanoid(),
    vilkarsgrunnlagId: nanoid(),
    vilkarsgrunnlaghistorikkId: nanoid(),
    ...overrides,
    medUtbetaling(utbetaling: Utbetaling): FetchedBeregnetPeriode {
        this.utbetaling = utbetaling;
        return this;
    },
    medSkjæringstidspunkt(skjæringstidspunkt: string): FetchedBeregnetPeriode {
        this.skjaeringstidspunkt = skjæringstidspunkt;
        return this;
    },
});

export const enGhostPeriode: OverridableConstructor<GhostPeriode> = (overrides) => ({
    id: nanoid(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    deaktivert: false,
    organisasjonsnummer: '987654321',
    skjaeringstidspunkt: '2020-01-01',
    vilkarsgrunnlagId: nanoid(),
    ...overrides,
});
