import dayjs from 'dayjs';

import { Arbeidsgiver, Maybe, Periode, Periodetilstand } from '@io/graphql';
import { isGodkjent as utbetalingIsGodkjent } from '@state/selectors/utbetaling';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (period?: Maybe<Periode | GhostPeriode>): Maybe<string> => {
    if (isBeregnetPeriode(period)) {
        return period.oppgave?.id ?? null;
    } else {
        return null;
    }
};

export const harBlittUtbetaltTidligere = (period: FetchedBeregnetPeriode, arbeidsgiver: Arbeidsgiver): boolean => {
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
                    utbetalingIsGodkjent(periode.utbetaling)
            ).length > 0
    );
};

export const isNotReady = (period: Periode) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
    ].includes(period.periodetilstand);

export const isInCurrentGeneration = (period: ActivePeriod, arbeidsgiver: Arbeidsgiver): boolean => {
    if (!isBeregnetPeriode(period) || !isUberegnetPeriode(period)) {
        return false;
    }

    return arbeidsgiver.generasjoner[0]?.perioder.some(
        (periode) => isBeregnetPeriode(periode) && periode.id === period.id
    );
};

export const isWaiting = (period: ActivePeriod): boolean => {
    return ['venter', 'venterPåKiling'].includes(getPeriodState(period));
};

export const isGodkjent = (period: ActivePeriod): boolean => {
    return ['utbetalt', 'utbetaltAutomatisk', 'revurdert', 'revurdertIngenUtbetaling'].includes(getPeriodState(period));
};

export const isTilGodkjenning = (period: ActivePeriod): boolean => {
    return getPeriodState(period) === 'tilGodkjenning';
};

export const overlapper =
    (other: Periode) =>
    (periode: Periode): boolean =>
        (dayjs(periode.fom).isSameOrAfter(other.fom) && dayjs(periode.fom).isSameOrBefore(other.tom)) ||
        (dayjs(periode.tom).isSameOrAfter(other.fom) && dayjs(periode.tom).isSameOrBefore(other.tom));
