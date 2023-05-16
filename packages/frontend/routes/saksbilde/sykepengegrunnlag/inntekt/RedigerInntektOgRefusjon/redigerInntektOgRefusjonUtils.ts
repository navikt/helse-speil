import { Arbeidsgiver, Utbetalingstatus } from '@io/graphql';
import { isWaiting } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

export const perioderMedSkjæringstidspunktHarMaksÉnFagsystemId = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString,
): boolean => {
    return (
        arbeidsgiver.generasjoner[0]?.perioder
            .filter(isBeregnetPeriode)
            .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
            .filter((periode) => periode.utbetaling.status !== Utbetalingstatus.Godkjentutenutbetaling)
            .reduce((ider, periode) => ider.add(periode.utbetaling.arbeidsgiverFagsystemId), new Set()).size <= 1
    );
};
export const kanRedigereInntektEllerRefusjon = (
    person: FetchedPerson,
    arbeidsgiver: Arbeidsgiver,
    periode: FetchedBeregnetPeriode,
): boolean => {
    return (
        !isWaiting(periode) &&
        perioderMedSkjæringstidspunktHarMaksÉnFagsystemId(arbeidsgiver, periode.skjaeringstidspunkt)
    );
};
