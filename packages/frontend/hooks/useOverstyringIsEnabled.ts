import { Inntektstype } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

const kunEnArbeidsgiver = (periode: FetchedBeregnetPeriode) => periode.inntektstype === Inntektstype.Enarbeidsgiver;

const overstyringEnabled = (periode: FetchedBeregnetPeriode): boolean =>
    kunEnArbeidsgiver(periode) &&
    ['tilGodkjenning', 'avslag', 'ingenUtbetaling', 'utbetalingFeilet'].includes(getPeriodState(periode));

export const useOverstyringIsEnabled = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return periode !== undefined && overstyringEnabled(periode);
};
