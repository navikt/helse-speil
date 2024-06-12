import { DateString } from '@/types/shared';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, Periode } from '@io/graphql';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode } from '@utils/typeguards';

const isValidDate = (date?: Maybe<DateString>): boolean => {
    return typeof date === 'string' && !isNaN(new Date(date).getTime());
};

const hasValidMaksdato = (period: BeregnetPeriodeFragment): boolean => {
    return isValidDate(period.maksdato);
};

const byFomDescending = (a: Periode, b: Periode): number => {
    return new Date(b.fom).getTime() - new Date(a.fom).getTime();
};

export const useMaksdato = (arbeidsgivere: Array<ArbeidsgiverFragment>): DateString | undefined =>
    arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter(isBeregnetPeriode)
        .sort(byFomDescending)
        .find(hasValidMaksdato)?.maksdato;
