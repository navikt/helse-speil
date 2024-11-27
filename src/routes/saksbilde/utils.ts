import * as R from 'remeda';

import { ArbeidsgiverFragment, PeriodeFragment, PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

export const harOverlappendeTilkommenInntekt = (person: PersonFragment, fom: string) =>
    person.arbeidsgivere.flatMap((ag) =>
        ag.nyeInntektsforholdPerioder.filter((it) => isTilkommenInntekt(it) && it.fom === fom),
    ).length > 0;

export const finnInitierendeVedtaksperiodeIdFraOverlappendePeriode = (
    arbeidsgivere: ArbeidsgiverFragment[],
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
