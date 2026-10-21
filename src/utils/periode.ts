import { ApiUberegnetPeriode, ApiUtbetalingsdagtype } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';

export const getAntallAGPDagerBruktFørPerioden = (inntektsforhold: Inntektsforhold, periode: ApiUberegnetPeriode) =>
    inntektsforhold.behandlinger[0]?.perioder
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt)
        .filter((it) => it.fom < periode.fom)
        .reverse()
        .flatMap((it) => it.tidslinje)
        .filter(
            (dag) =>
                dag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG' ||
                (['SYKEDAG', 'SYK_HELGEDAG'].includes(dag.sykdomsdagtype) &&
                    dag.utbetalingsdagtype === ApiUtbetalingsdagtype.UKJENT_DAG),
        ).length;
