import { BeregnetPeriodeFragment } from '@/io/graphql';
import { useCurrentPerson } from '@person/query';
import { findArbeidsgiverWithPeriode, useCurrentArbeidsgiver, usePeriodIsInGeneration } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useForrigeGenerasjonPeriode = () => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();
    const currentGeneration = usePeriodIsInGeneration();
    const aktivPeriod = useActivePeriod();

    if (!currentArbeidsgiver || currentGeneration === null || !isBeregnetPeriode(aktivPeriod)) {
        return null;
    }

    return currentArbeidsgiver.generasjoner[currentGeneration + 1]?.perioder.find(
        (periode) => periode.vedtaksperiodeId === aktivPeriod.vedtaksperiodeId,
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
