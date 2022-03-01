import { Arbeidsgiver, BeregnetPeriode, UberegnetPeriode } from '@io/graphql';
import { useActivePeriod } from '@state/periodState';
import { useCurrentPerson } from '@state/personState';

export const useCurrentArbeidsgiver = (): Arbeidsgiver | null => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!currentPerson || !activePeriod) {
        return null;
    }

    return (
        currentPerson.arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.generasjoner
                .flatMap((generasjon) => generasjon.perioder)
                .filter((periode): periode is UberegnetPeriode | BeregnetPeriode => (periode as any).id)
                .find((periode: UberegnetPeriode | BeregnetPeriode) => periode.id === activePeriod.id)
        ) ?? null
    );
};
