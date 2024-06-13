import { ArbeidsgiverFragment, BeregnetPeriodeFragment } from '@io/graphql';
import { useCurrentPerson } from '@person/query';
import { findArbeidsgiverWithPeriode, usePeriodIsInGeneration } from '@state/arbeidsgiver';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useForrigeGenerasjonPeriode = (
    currentArbeidsgiver: ArbeidsgiverFragment,
    activePeriod: BeregnetPeriodeFragment,
) => {
    const currentGeneration = usePeriodIsInGeneration();

    if (currentGeneration === null) {
        return null;
    }

    return currentArbeidsgiver.generasjoner[currentGeneration + 1]?.perioder.find(
        (periode) => periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId,
    );
};

export const useForrigeGenerasjonPeriodeMedPeriode = (periode: BeregnetPeriodeFragment) => {
    const person = useCurrentPerson();
    const currentArbeidsgiver = findArbeidsgiverWithPeriode(periode, person?.arbeidsgivere ?? []);

    const currentGeneration = currentArbeidsgiver?.generasjoner.findIndex((generasjon) =>
        generasjon.perioder.some((_periode) => isBeregnetPeriode(_periode) && _periode.id === periode.id),
    );

    if (!currentArbeidsgiver || currentGeneration === undefined || !isBeregnetPeriode(periode)) {
        return null;
    }

    return currentArbeidsgiver.generasjoner[currentGeneration + 1]?.perioder.find(
        (_periode) => _periode.vedtaksperiodeId === periode.vedtaksperiodeId,
    );
};
