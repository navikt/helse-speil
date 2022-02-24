import { Arbeidsgiver } from '@io/graphql';

import { isBeregnetPeriode } from './mapping';

export const useMaksdato = (arbeidsgivere: Array<Arbeidsgiver>): DateString | undefined =>
    arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter(isBeregnetPeriode)
        .find((it) => it.maksdato)?.maksdato;
