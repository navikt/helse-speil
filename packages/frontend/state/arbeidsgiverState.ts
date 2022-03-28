import { Arbeidsgiver, BeregnetPeriode, GhostPeriode, Periode, UberegnetPeriode } from '@io/graphql';
import { useActivePeriod } from '@state/periodState';
import { useCurrentPerson } from '@state/personState';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriode | Periode,
    arbeidsgivere: Array<Arbeidsgiver>
): Arbeidsgiver | null => {
    if (!isGhostPeriode(period)) {
        return null;
    }

    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.ghostPerioder.find(
                (periode) => periode.vilkarsgrunnlaghistorikkId === period.vilkarsgrunnlaghistorikkId
            )
        ) ?? null
    );
};

const findArbeidsgiverWithPeriode = (
    period: BeregnetPeriode | UberegnetPeriode,
    arbeidsgivere: Array<Arbeidsgiver>
): Arbeidsgiver | null => {
    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.generasjoner
                .flatMap((generasjon) => generasjon.perioder)
                .filter((periode): periode is UberegnetPeriode | BeregnetPeriode => (periode as any).id)
                .find((periode: UberegnetPeriode | BeregnetPeriode) => periode.id === period.id)
        ) ?? null
    );
};

export const useCurrentArbeidsgiver = (): Arbeidsgiver | null => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!currentPerson || !activePeriod) {
        return null;
    } else if (isBeregnetPeriode(activePeriod) || isUberegnetPeriode(activePeriod)) {
        return findArbeidsgiverWithPeriode(activePeriod, currentPerson.arbeidsgivere);
    } else if (isGhostPeriode(activePeriod)) {
        return findArbeidsgiverWithGhostPeriode(activePeriod, currentPerson.arbeidsgivere);
    } else {
        return null;
    }
};
