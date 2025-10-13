import * as R from 'remeda';
import { isTruthy } from 'remeda';

import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt = (
    arbeidsgivere: Array<Inntektsforhold>,
    period: ActivePeriod,
): string =>
    R.pipe(
        arbeidsgivere,
        R.flatMap((foo) => foo.generasjoner?.[0]?.perioder),
        R.filter(isTruthy),
        R.sortBy([(it) => it.fom, 'asc']),
        R.find(
            (periode) =>
                periode?.skjaeringstidspunkt == period.skjaeringstidspunkt &&
                (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)),
        ),
        (periode) => periode!.vedtaksperiodeId,
    );
