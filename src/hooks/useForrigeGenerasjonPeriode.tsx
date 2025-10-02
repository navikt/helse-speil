import { ArbeidsgiverFragment, BeregnetPeriodeFragment, Periode, PersonFragment } from '@io/graphql';
import { finnAktivGenerasjon, finnGenerasjonerForAktivPeriode } from '@state/arbeidsgiver';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useForrigeGenerasjonPeriode = (
    currentArbeidsgiver: ArbeidsgiverFragment,
    activePeriod: BeregnetPeriodeFragment,
    person: PersonFragment,
): Periode | undefined => {
    const aktivGenerasjon = finnAktivGenerasjon(person, activePeriod);

    if (aktivGenerasjon == undefined) {
        return undefined;
    }

    const aktivGenerasjonIndex = currentArbeidsgiver.generasjoner.findIndex(
        (generasjon) => generasjon.id === aktivGenerasjon?.id,
    );

    return currentArbeidsgiver.generasjoner[aktivGenerasjonIndex + 1]?.perioder.find(
        (periode) => periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId,
    );
};

export const useForrigeGenerasjonPeriodeMedPeriode = (periode: BeregnetPeriodeFragment, person: PersonFragment) => {
    const generasjoner = finnGenerasjonerForAktivPeriode(periode, person);

    const currentGeneration = generasjoner.findIndex((generasjon) =>
        generasjon.perioder.some((_periode) => isBeregnetPeriode(_periode) && _periode.id === periode.id),
    );

    if (currentGeneration === undefined || !isBeregnetPeriode(periode)) {
        return null;
    }

    return generasjoner[currentGeneration + 1]?.perioder.find(
        (_periode) => _periode.vedtaksperiodeId === periode.vedtaksperiodeId,
    );
};
