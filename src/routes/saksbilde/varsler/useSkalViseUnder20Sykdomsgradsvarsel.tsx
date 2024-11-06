import { useBrukerIdent } from '@auth/brukerContext';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { ActivePeriod } from '@typer/shared';
import { kanOverstyreMinimumSykdomsgradToggle } from '@utils/featureToggles';
import { isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

export const useSkalViseUnder20SykdomsgradsvarselSomFeil = () => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const arbeidsgiver = useCurrentArbeidsgiver(person);
    const aktivPeriode = useActivePeriod(person);
    const saksbehandlerident = useBrukerIdent();

    if (!person || !aktivPeriode?.skjaeringstidspunkt) return false;

    const sammenlignSkjæringstidspunkt = erPeriodePåSkjæringstidspunkt(aktivPeriode.skjaeringstidspunkt);

    const harFlereArbeidsgiverePåSkjæringstidspunkt =
        person.arbeidsgivere.filter(
            (it) =>
                it.generasjoner[0]?.perioder.filter(sammenlignSkjæringstidspunkt) ||
                it.ghostPerioder.filter(sammenlignSkjæringstidspunkt),
        )?.length > 1;

    const harBlittVurdert =
        arbeidsgiver?.overstyringer.some(
            (it) => isMinimumSykdomsgradsoverstyring(it) && it.minimumSykdomsgrad.fom === aktivPeriode.fom,
        ) ?? false;

    return (
        !harBlittVurdert &&
        harFlereArbeidsgiverePåSkjæringstidspunkt &&
        kanOverstyreMinimumSykdomsgradToggle(saksbehandlerident)
    );
};

const erPeriodePåSkjæringstidspunkt = (skjæringstidspunkt: string) => (periode: ActivePeriod) =>
    periode.skjaeringstidspunkt === skjæringstidspunkt;
