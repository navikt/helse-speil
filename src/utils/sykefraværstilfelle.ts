import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt = (
    arbeidsgivere: Inntektsforhold[],
    period: ActivePeriod,
): string =>
    arbeidsgivere
        .flatMap((foo) => foo.behandlinger?.[0]?.perioder)
        .filter((it) => it !== undefined)
        .toSorted((a, b) => (a.fom < b.fom ? -1 : a.fom > b.fom ? 1 : 0))
        .find(
            (periode) =>
                periode?.skjaeringstidspunkt == period.skjaeringstidspunkt &&
                (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)),
        )!.vedtaksperiodeId;
