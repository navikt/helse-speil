import { Person, Vedtaksperiode } from '../context/types';

// Finner første vedtaksperiode i en serie av sammenhengende vedtaksperioder
export const finnFørsteVedtaksperiode = (nåværendePeriode: Vedtaksperiode, person: Person): Vedtaksperiode =>
    person.arbeidsgivere
        .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
        .filter(periode => periode.kanVelges)
        .map(periode => periode as Vedtaksperiode)
        .filter(periode => periode.utbetalingsreferanse === nåværendePeriode.utbetalingsreferanse)
        .sort((a, b) => (a.sykdomstidslinje[0].dato.isAfter(b.sykdomstidslinje[0].dato) ? 1 : -1))[0];
