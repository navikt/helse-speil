import { Maybe, Periode } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

export const getOppgavereferanse = (period?: Maybe<Periode | GhostPeriode>): Maybe<string> => {
    if (isBeregnetPeriode(period)) {
        return period.oppgave?.id ?? null;
    } else {
        return null;
    }
};
