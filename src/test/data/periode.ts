import {
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiInntektstype,
    ApiKildetype,
    ApiPeriodetilstand,
    ApiPeriodetype,
    ApiSykdomsdagtype,
    ApiUberegnetPeriode,
    ApiUtbetaling,
    ApiUtbetalingsdagtype,
    ApiUtbetalingstatus,
    ApiUtbetalingtype,
    ApiVarselDTO,
} from '@io/rest/generated/spesialist.schemas';
import { TestDag } from '@test-data/person-query-types';
import { enUtbetaling } from '@test-data/utbetaling';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enDag: OverridableConstructor<TestDag> = (overrides) => ({
    dato: '2020-01-01',
    grad: 100,
    kilde: {
        id: generateId(),
        type: ApiKildetype.SOKNAD,
    },
    sykdomsdagtype: ApiSykdomsdagtype.SYKEDAG,
    utbetalingsdagtype: ApiUtbetalingsdagtype.NAVDAG,
    begrunnelser: null,
    utbetalingsinfo: {
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
    medUtbetaling(utbetaling: ApiUtbetaling): ApiBeregnetPeriode & Extensions;
    medSkjæringstidspunkt(skjæringstidspunkt: string): ApiBeregnetPeriode & Extensions;
    medVarsler(varseler: ApiVarselDTO[]): ApiBeregnetPeriode & Extensions;
    somErForkastet(): ApiBeregnetPeriode & Extensions;
    somErTilGodkjenning(): ApiBeregnetPeriode & Extensions;
    somErTilRevurdering(): ApiBeregnetPeriode & Extensions;
};

export const enBeregnetPeriode: OverridableConstructor<ApiBeregnetPeriode, Extensions> = (overrides) => ({
    type: 'ApiBeregnetPeriode',
    id: generateId(),
    behandlingId: generateId(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [enDag()],
    opprettet: '2020-01-01',
    aktivitetslogg: [],
    erForkastet: false,
    forbrukteSykedager: 0,
    gjenstaendeSykedager: 200,
    hendelser: [],
    paVent: null,
    risikovurdering: null,
    inntektstype: ApiInntektstype.ENARBEIDSGIVER,
    maksdato: '2020-12-30',
    notater: [],
    historikkinnslag: [],
    periodetilstand: ApiPeriodetilstand.Utbetalt,
    periodetype: ApiPeriodetype.FORSTEGANGSBEHANDLING,
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
    vedtaksperiodeId: generateId(),
    vilkarsgrunnlagId: generateId(),
    avslag: [],
    vedtakBegrunnelser: [],
    ...overrides,
    medVarsler(varseler: ApiVarselDTO[]) {
        this.varsler = varseler;
        return this;
    },
    medUtbetaling(utbetaling: ApiUtbetaling) {
        this.utbetaling = utbetaling;
        return this;
    },
    medSkjæringstidspunkt(skjæringstidspunkt: string) {
        this.skjaeringstidspunkt = skjæringstidspunkt;
        return this;
    },
    somErForkastet() {
        this.utbetaling = this.utbetaling ?? enUtbetaling();
        this.utbetaling.status = ApiUtbetalingstatus.FORKASTET;
        this.erForkastet = true;
        return this;
    },
    somErTilGodkjenning() {
        this.periodetilstand = ApiPeriodetilstand.TilGodkjenning;
        return this;
    },
    somErTilRevurdering() {
        this.periodetilstand = ApiPeriodetilstand.TilGodkjenning;
        this.utbetaling = this.utbetaling ?? enUtbetaling();
        this.utbetaling.type = ApiUtbetalingtype.REVURDERING;
        return this;
    },
    egenskaper: [],
    annullering: null,
    pensjonsgivendeInntekter: [],
    annulleringskandidater: [],
    grunnbelopsjustertGjennomsnitt: null,
});

export const enUberegnetPeriode: OverridableConstructor<ApiUberegnetPeriode> = (overrides) => ({
    type: 'ApiUberegnetPeriode',
    behandlingId: generateId(),
    erForkastet: false,
    fom: '2020-01-01',
    hendelser: [],
    id: generateId(),
    inntektstype: ApiInntektstype.ENARBEIDSGIVER,
    notater: [],
    opprettet: '2020-01-01',
    periodetilstand: ApiPeriodetilstand.IngenUtbetaling,
    periodetype: ApiPeriodetype.FORSTEGANGSBEHANDLING,
    skjaeringstidspunkt: '2020-01-01',
    tidslinje: [enDag()],
    tom: '2020-01-30',
    varsler: [],
    vedtaksperiodeId: generateId(),
    aktivitetslogg: [],
    historikkinnslag: [],
    ...overrides,
});

export const enGhostPeriode: OverridableConstructor<ApiGhostPeriode> = (overrides) => ({
    id: generateId(),
    fom: '2020-01-01',
    tom: '2020-01-30',
    deaktivert: false,
    organisasjonsnummer: '987654321',
    skjaeringstidspunkt: '2020-01-01',
    vilkarsgrunnlagId: generateId(),
    ...overrides,
});
