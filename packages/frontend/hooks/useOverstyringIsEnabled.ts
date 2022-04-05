import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { Inntektstype } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

const kunEnArbeidsgiver = (periode: BeregnetPeriode) => periode.inntektstype === Inntektstype.Enarbeidsgiver;

const overstyringEnabled = (periode: BeregnetPeriode): boolean =>
    kunEnArbeidsgiver(periode) && ['oppgaver', 'avslag', 'ingenUtbetaling', 'feilet'].includes(getPeriodState(periode));

export const useOverstyringIsEnabled = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return periode !== undefined && overstyringEnabled(periode);
};
