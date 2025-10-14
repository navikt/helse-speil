import { BeregnetPeriodeFragment, Periode } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

const isValidDate = (date?: DateString | null): boolean => {
    return typeof date === 'string' && !isNaN(new Date(date).getTime());
};

const hasValidMaksdato = (period: BeregnetPeriodeFragment): boolean => {
    return isValidDate(period.maksdato);
};

const byFomDescending = (a: Periode, b: Periode): number => {
    return new Date(b.fom).getTime() - new Date(a.fom).getTime();
};

export const useMaksdato = (inntektsforhold: Array<Inntektsforhold>): DateString | undefined =>
    inntektsforhold
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter(isBeregnetPeriode)
        .sort(byFomDescending)
        .find(hasValidMaksdato)?.maksdato;
