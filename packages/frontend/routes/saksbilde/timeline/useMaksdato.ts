import { Arbeidsgiver } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useMaksdato = (arbeidsgivere: Array<Arbeidsgiver>): DateString | undefined =>
    arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter(isBeregnetPeriode)
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .find((it) => it.maksdato)?.maksdato;
