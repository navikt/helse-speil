import { InntektskildeType, Tidslinjetilstand } from 'internal-types';

import { Tidslinjeperiode } from '../modell/utbetalingshistorikkelement';
import { useAktivPeriode } from '../state/tidslinje';

const kunEnArbeidsgiver = (periode: Tidslinjeperiode) => periode.inntektskilde === InntektskildeType.EnArbeidsgiver;

const overstyringEnabled = (periode: Tidslinjeperiode): boolean =>
    kunEnArbeidsgiver(periode) &&
    [
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand);

export const useOverstyringIsEnabled = (): boolean => {
    const periode = useAktivPeriode();

    return periode !== undefined && overstyringEnabled(periode);
};
