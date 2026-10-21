import { ApiBeregnetPeriode, ApiPeriode } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

const isValidDate = (date?: DateString | null): boolean => {
    return typeof date === 'string' && !isNaN(new Date(date).getTime());
};

const hasValidMaksdato = (period: ApiBeregnetPeriode): boolean => {
    return isValidDate(period.maksdato);
};

const byFomDescending = (a: ApiPeriode, b: ApiPeriode): number => {
    return new Date(b.fom).getTime() - new Date(a.fom).getTime();
};

export const useMaksdato = (inntektsforhold: Inntektsforhold[]): DateString | undefined =>
    inntektsforhold
        .flatMap((it) => it.behandlinger[0]?.perioder)
        .filter(isBeregnetPeriode)
        .sort(byFomDescending)
        .find(hasValidMaksdato)?.maksdato;
