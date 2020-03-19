import { Person, Vedtaksperiode } from '../context/types';
import dayjs from 'dayjs';

/**
 * Finner første vedtaksperiode i en serie av sammenhengende vedtaksperioder
 */
export const finnFørsteVedtaksperiode = (nåværendePeriode: Vedtaksperiode, person: Person): Vedtaksperiode => {
    return person.arbeidsgivere
        .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
        .filter(periode => periode.utbetalingsreferanse === nåværendePeriode.utbetalingsreferanse)
        .sort((a, b) => (dayjs(a.sykdomstidslinje[0].dagen).isAfter(b.sykdomstidslinje[0].dagen) ? 1 : -1))[0]!;
};
