import { InntektskildeType, Tidslinjetilstand } from 'internal-types';

import { Tidslinjeperiode } from '../modell/utbetalingshistorikkelement';
import { useAktivPeriode } from '../state/tidslinje';

import { UtbetalingToggles } from '../featureToggles';

const kunEnArbeidsgiver = (periode: Tidslinjeperiode) => periode.inntektskilde === InntektskildeType.EnArbeidsgiver;

const overstyringEnabled = (periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean =>
    toggles.overstyrbareTabellerEnabled &&
    kunEnArbeidsgiver(periode) &&
    [
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand);

export const useOverstyringIsEnabled = (toggles: UtbetalingToggles): boolean => {
    const periode = useAktivPeriode();

    return periode !== undefined && overstyringEnabled(periode, toggles);
};
