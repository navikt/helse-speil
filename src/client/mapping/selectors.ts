import dayjs, { Dayjs } from 'dayjs';
import { Person, Vedtaksperiode } from 'internal-types';

import { trimLedendeArbeidsdager } from '../routes/saksbilde/sykmeldingsperiode/Sykmeldingsperiode';

const tidligsteVedtaksperiode = (a: Vedtaksperiode, b: Vedtaksperiode) => {
    const aSykdomsdager = trimLedendeArbeidsdager(a.sykdomstidslinje);
    const bSykdomsdager = trimLedendeArbeidsdager(b.sykdomstidslinje);
    return aSykdomsdager[0].dato.isAfter(bSykdomsdager[0].dato) ? 1 : -1;
};

export const førsteVedtaksperiode = (nåværendePeriode: Vedtaksperiode, person: Person): Vedtaksperiode =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.vedtaksperioder)
        .filter((periode) => periode.fullstendig)
        .map((periode) => periode as Vedtaksperiode)
        .filter((periode) => periode.gruppeId === nåværendePeriode.gruppeId)
        .sort(tidligsteVedtaksperiode)[0];

export const organisasjonsnummerForPeriode = (nåværendePeriode: Vedtaksperiode, person: Person): string =>
    person.arbeidsgivere.find(({ vedtaksperioder }) => vedtaksperioder.find(({ id }) => id === nåværendePeriode.id))!
        .organisasjonsnummer;

export const maksdatoForPeriode = ({ vilkår }: Vedtaksperiode): Dayjs | undefined => vilkår?.dagerIgjen.maksdato;

export const maksdatoForPerson = (person: Person): Dayjs | undefined => {
    const sistePeriode = sisteValgbarePeriode(person);

    return sistePeriode && maksdatoForPeriode(sistePeriode);
};

export const skjæringstidspunktForPeriode = ({ vilkår }: Vedtaksperiode): Dayjs | undefined =>
    vilkår?.dagerIgjen?.skjæringstidspunkt;

export const sisteValgbarePeriode = (person: Person): Vedtaksperiode | undefined =>
    person.arbeidsgivere
        .flatMap(({ vedtaksperioder }) => vedtaksperioder)
        .filter(({ fullstendig }) => fullstendig)
        .map((periode) => periode as Vedtaksperiode)
        .reduce(
            (sistePeriode: Vedtaksperiode | undefined, it) =>
                it.tom.isAfter(sistePeriode?.tom ?? dayjs(0)) ? it : sistePeriode,
            undefined
        );
