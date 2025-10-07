import dayjs from 'dayjs';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    Periode,
    Periodetilstand,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { Inntektsforhold } from '@state/arbeidsgiver';
import { isGodkjent as utbetalingIsGodkjent } from '@state/selectors/utbetaling';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (
    period?: Maybe<BeregnetPeriodeFragment | UberegnetPeriodeFragment | GhostPeriodeFragment>,
): Maybe<string> => {
    if (isBeregnetPeriode(period)) {
        return period.oppgave?.id ?? null;
    } else {
        return null;
    }
};

export const harBlittUtbetaltTidligere = (
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    inntektsforhold: Inntektsforhold,
): boolean => {
    if (inntektsforhold.generasjoner.length <= 1) {
        return false;
    }

    return (
        inntektsforhold.generasjoner
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

export const isNotReady = (period: Periode) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
        Periodetilstand.AvventerInntektsopplysninger,
    ].includes(period.periodetilstand);

export const isInCurrentGeneration = (period: ActivePeriod, arbeidsgiver: Inntektsforhold): boolean => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    if ((!isBeregnetPeriode(period) && !isUberegnetPeriode(period)) || sisteGenerasjon == undefined) {
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

export const isForkastet = (periode?: Maybe<Periode>): boolean => {
    return (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) && periode.erForkastet;
};
