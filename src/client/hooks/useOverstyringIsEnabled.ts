import { Person, Tidslinjetilstand } from 'internal-types';

import { Tidslinjeperiode } from '../modell/utbetalingshistorikkelement';
import { usePerson } from '../state/person';
import { useAktivPeriode } from '../state/tidslinje';

import { UtbetalingToggles } from '../featureToggles';

const kunEnArbeidsgiver = (person: Person) => person.arbeidsgivere.length === 1;

const overstyringEnabled = (person: Person, periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean =>
    toggles.overstyrbareTabellerEnabled &&
    kunEnArbeidsgiver(person) &&
    [
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand);

export const useOverstyringIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useAktivPeriode();
    const person = usePerson();

    return periode !== undefined && person !== undefined && overstyringEnabled(person, periode, toggles);
};
