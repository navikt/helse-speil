import { useMaybeAktivPeriode } from '../state/tidslinje';

const kunEnArbeidsgiver = (periode: TidslinjeperiodeMedSykefravær) => periode.inntektskilde === 'EN_ARBEIDSGIVER';

const overstyringEnabled = (periode: TidslinjeperiodeMedSykefravær): boolean =>
    kunEnArbeidsgiver(periode) && ['oppgaver', 'avslag', 'ingenUtbetaling', 'feilet'].includes(periode.tilstand);

export const useOverstyringIsEnabled = (): boolean => {
    const periode = useMaybeAktivPeriode();

    return periode !== undefined && overstyringEnabled(periode);
};
