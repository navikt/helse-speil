import { Arbeidsgiver, Periode } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

const isValidDate = (date?: Maybe<DateString>): boolean => {
    return typeof date === 'string' && !isNaN(new Date(date).getTime());
};

const hasValidMaksdato = (period: FetchedBeregnetPeriode): boolean => {
    return isValidDate(period.maksdato);
};

const byFomDescending = (a: Periode, b: Periode): number => {
    return new Date(b.fom).getTime() - new Date(a.fom).getTime();
};

export const useMaksdato = (arbeidsgivere: Array<Arbeidsgiver>): DateString | undefined =>
    arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter(isBeregnetPeriode)
        .sort(byFomDescending)
        .find(hasValidMaksdato)?.maksdato;
