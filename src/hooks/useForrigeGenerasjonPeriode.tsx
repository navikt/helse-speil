import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { finnGenerasjonerForAktivPeriode } from '@state/inntektsforhold/inntektsforhold';
import { isBeregnetPeriode } from '@utils/typeguards';

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
