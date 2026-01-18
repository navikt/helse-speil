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
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isGodkjent as utbetalingIsGodkjent } from '@state/selectors/utbetaling';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (
    period?: Maybe<BeregnetPeriodeFragment | UberegnetPeriodeFragment | GhostPeriodeFragment>,
): string | null => {
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
    if (inntektsforhold.behandlinger.length <= 1) {
        return false;
    }

    return (
        inntektsforhold.behandlinger
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
    const sisteBehandling = arbeidsgiver.behandlinger[0];
    if ((!isBeregnetPeriode(period) && !isUberegnetPeriode(period)) || sisteBehandling == undefined) {
        return false;
    }

    return sisteBehandling.perioder.some((periode) => periode.id === period.id);
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
): BeregnetPeriodeFragment[] => {
    return person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.behandlinger[0]?.perioder ?? [])
        .filter(isBeregnetPeriode)
        .filter(overlapper(period)) as BeregnetPeriodeFragment[];
};

export const isForkastet = (periode?: Periode | null): boolean => {
    return (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) && periode.erForkastet;
};
