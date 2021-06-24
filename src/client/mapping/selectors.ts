import dayjs, { Dayjs } from 'dayjs';
import { Dag, Dagtype, Person, Vedtaksperiode } from 'internal-types';

const trimLedendeArbeidsdager = (sykdomstidslinje: Dag[]): Dag[] => {
    const førsteIkkearbeidsdag = sykdomstidslinje.findIndex((dag) => dag.type !== Dagtype.Arbeidsdag) ?? 0;
    return sykdomstidslinje.slice(førsteIkkearbeidsdag);
};

const byTidligsteVedtaksperiode = (a: Vedtaksperiode, b: Vedtaksperiode): number => {
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
        .sort(byTidligsteVedtaksperiode)[0];

export const organisasjonsnummerForPeriode = (nåværendePeriode: Vedtaksperiode, person: Person): string =>
    person.arbeidsgivere.find(({ vedtaksperioder }) => vedtaksperioder.find(({ id }) => id === nåværendePeriode.id))!
        .organisasjonsnummer;

export const maksdatoForPeriode = ({ vilkår }: Vedtaksperiode): Dayjs | undefined => vilkår?.dagerIgjen.maksdato;

export const maksdatoForPerson = (person: Person): Dayjs | undefined => {
    const sistePeriode = sisteValgbarePeriode(person);

    return sistePeriode && maksdatoForPeriode(sistePeriode);
};

export const getSkjæringstidspunkt = ({ vilkår }: Vedtaksperiode): Dayjs | undefined =>
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

export const erOver67År = (vedtaksperiode: Vedtaksperiode): boolean =>
    (vedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67;

export const getMånedsbeløp = (vedtaksperiode: Vedtaksperiode, organisasjonsnummer: string): number | undefined =>
    vedtaksperiode.inntektsgrunnlag?.inntekter?.find((it) => it.organisasjonsnummer === organisasjonsnummer)
        ?.omregnetÅrsinntekt?.månedsbeløp;
