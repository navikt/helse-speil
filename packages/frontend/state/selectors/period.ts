import { Arbeidsgiver, Maybe, Periode, Periodetilstand } from '@io/graphql';
import { isGodkjent } from '@state/selectors/utbetaling';
import { isBeregnetPeriode } from '@utils/typeguards';

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
                    isGodkjent(periode.utbetaling)
            ).length > 0
    );
};

export const isNotReady = (period: Periode) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
    ].includes(period.periodetilstand);
