// Finner første vedtaksperiode i en serie av sammenhengende vedtaksperioder
import { Person, Vedtaksperiode } from 'internal-types';

export const førsteVedtaksperiode = (nåværendePeriode: Vedtaksperiode, person: Person): Vedtaksperiode =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.vedtaksperioder)
        .filter((periode) => periode.kanVelges)
        .map((periode) => periode as Vedtaksperiode)
        .filter((periode) => periode.gruppeId === nåværendePeriode.gruppeId)
        .sort((a, b) => (a.sykdomstidslinje[0].dato.isAfter(b.sykdomstidslinje[0].dato) ? 1 : -1))[0];

export const organisasjonsnummerForPeriode = (nåværendePeriode: Vedtaksperiode, person: Person): string =>
    person.arbeidsgivere.find(({ vedtaksperioder }) => vedtaksperioder.find(({ id }) => id === nåværendePeriode.id))!
        .organisasjonsnummer;

export const arbeidsgivernavnForVedtaksperiode = (person: Person, vedtaksperiodeId: string): string =>
    person.arbeidsgivere.find(({ vedtaksperioder }) => vedtaksperioder.find(({ id }) => id === vedtaksperiodeId))
        ?.navn ?? 'Arbeidsgiver';
