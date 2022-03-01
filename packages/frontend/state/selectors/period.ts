import { Maybe, Periode } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (period?: Maybe<Periode>): Maybe<string> | undefined => {
    if (isBeregnetPeriode(period)) {
        return period.oppgavereferanse;
    } else {
        return null;
    }
};
