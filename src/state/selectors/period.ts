import dayjs from 'dayjs';

import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PeriodeFragment,
    Periodetilstand,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { isGodkjent as utbetalingIsGodkjent } from '@state/selectors/utbetaling';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isNotNullOrUndefined, isUberegnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (
    period?: Maybe<
        BeregnetPeriodeFragment | UberegnetPeriodeFragment | GhostPeriodeFragment | NyttInntektsforholdPeriodeFragment
    >,
): Maybe<string> => {
    if (isBeregnetPeriode(period)) {
        return period.oppgave?.id ?? null;
    } else {
        return null;
    }
};

export const harBlittUtbetaltTidligere = (
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    arbeidsgiver: ArbeidsgiverFragment,
): boolean => {
    if (arbeidsgiver.generasjoner.length <= 1) {
        return false;
    }

    return (
        arbeidsgiver.generasjoner
            .slice(1)
            .flatMap(({ perioder }) => perioder)
            .filter(
                (periode) =>
                    isBeregnetPeriode(periode) &&
                    periode.vedtaksperiodeId === period.vedtaksperiodeId &&
                    utbetalingIsGodkjent(periode.utbetaling),
            ).length > 0
    );
};

export const isNotReady = (period: PeriodeFragment) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
        Periodetilstand.AvventerInntektsopplysninger,
    ].includes(period.periodetilstand);

export const isInCurrentGeneration = (period: ActivePeriod, arbeidsgiver: ArbeidsgiverFragment): boolean => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    if ((!isBeregnetPeriode(period) && !isUberegnetPeriode(period)) || !isNotNullOrUndefined(sisteGenerasjon)) {
        return false;
    }

    return sisteGenerasjon.perioder.some((periode) => periode.id === period.id);
};
export const isGodkjent = (period: ActivePeriod): boolean => {
    return ['utbetalt', 'utbetaltAutomatisk', 'revurdert', 'revurdertIngenUtbetaling'].includes(getPeriodState(period));
};
export const overlapper =
    (other: ActivePeriod | DatePeriod) =>
    (periode: ActivePeriod | DatePeriod): boolean =>
        (dayjs(periode.fom).isSameOrAfter(other.fom) && dayjs(periode.fom).isSameOrBefore(other.tom)) ||
        (dayjs(periode.tom).isSameOrAfter(other.fom) && dayjs(periode.tom).isSameOrBefore(other.tom));

export const getOverlappendePerioder = (
    person: PersonFragment,
    period: BeregnetPeriodeFragment,
): Array<BeregnetPeriodeFragment> => {
    return person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .filter(isBeregnetPeriode)
        .filter(overlapper(period)) as Array<BeregnetPeriodeFragment>;
};

export const isForkastet = (periode?: Maybe<ActivePeriod>): boolean => {
    return (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) && periode.erForkastet;
};
