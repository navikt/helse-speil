import * as R from 'remeda';

import { PeriodeFragment } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const finnInitierendeVedtaksperiodeIdFraOverlappendePeriode = (
    arbeidsgivere: Inntektsforhold[],
    aktivPeriode: ActivePeriod,
) => {
    const allePerioderPåSkjæringstidspunkt: PeriodeFragment[] = R.pipe(
        arbeidsgivere,
        R.flatMap((ag) => ag.generasjoner?.[0]?.perioder),
        R.filter((periode) => isBeregnetPeriode(periode) || isUberegnetPeriode(periode)),
        R.filter((periode) => periode.skjaeringstidspunkt === aktivPeriode.skjaeringstidspunkt),
    );

    const sammenfallendePerioder = allePerioderPåSkjæringstidspunkt.filter(
        (periode) => periode.fom === aktivPeriode.fom && periode.tom === aktivPeriode.tom,
    );

    return sammenfallendePerioder?.shift()?.vedtaksperiodeId;
};
